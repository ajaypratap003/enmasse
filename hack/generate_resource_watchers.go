//+build ignore

/*
 * Copyright 2019, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"strings"
	"text/template"
	"time"
)

func main() {

	var scope = flag.String("scope", "namespaced",
		"resource scope")
	var watchAll = flag.Bool("watchAll", true,
		"if true, generate a watch that watches NamespaceAll, if false, ctor requires a namespace argument")
	flag.Parse()

	name := flag.Args()[0]
	clientInterface := flag.Args()[1]
	clientPackage := flag.Args()[2]
	typePackage := flag.Args()[3]

	f, err := os.Create(fmt.Sprintf("resource_watcher_%s.go", strings.ToLower(name)))
	die(err)
	defer f.Close()

	var plural string
	if strings.HasSuffix(name, "s") {
		plural = name + "es"
	} else {
		plural = name + "s"
	}

	packageTemplate.Execute(f, struct {
		Timestamp       time.Time
		Name            string
		NamePlural      string
		ClientPackage   string
		ClientInterface string
		TypePackage     string
		Scope           string
		WatchAll        bool
	}{
		Timestamp:       time.Now(),
		Name:            name,
		NamePlural:      plural,
		ClientInterface: clientInterface,
		ClientPackage:   clientPackage,
		TypePackage:     typePackage,
		Scope:           strings.ToLower(*scope),
		WatchAll:        *watchAll,
	})
}

func die(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

var packageTemplate = template.Must(template.New("").Parse(
	`/*
 * Copyright 2019, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

// Code generated by go generate; DO NOT EDIT.

package watchers

import (
	"fmt"
	tp "{{ .TypePackage }}"
	cp "{{ .ClientPackage }}"
	"github.com/enmasseproject/enmasse/pkg/consolegraphql/cache"
	"k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/watch"
	"k8s.io/client-go/rest"
	"log"
	"reflect"
)

type {{ .Name }}Watcher struct {
	Namespace       string
	cache.Cache
	ClientInterface cp.{{ .ClientInterface }}
	watching        chan struct{}
    watchingStarted bool
	stopchan        chan struct{}
	stoppedchan     chan struct{}
    create          func(*tp.{{ .Name }}) interface{}
    update          func(*tp.{{ .Name }}, interface{}) bool
}

func New{{ .Name }}Watcher(c cache.Cache, {{if not .WatchAll}}namespace string, {{end}}options... WatcherOption) (ResourceWatcher, error) {

    kw := &{{ .Name }}Watcher{
		Namespace:       {{if .WatchAll}}v1.NamespaceAll{{else}}namespace{{end}},
		Cache:           c,
		watching:        make(chan struct{}),
		stopchan:        make(chan struct{}),
		stoppedchan:     make(chan struct{}),
		create:          func(v *tp.{{ .Name }}) interface{} {
                             return v
                         },
	    update:          func(v *tp.{{ .Name }}, e interface{}) bool {
                             if !reflect.DeepEqual(v, e) {
                                 *e.(*tp.{{ .Name }}) = *v
                                 return true
                             } else {
                                 return false
                             }
                         },
    }

    for _, option := range options {
        option(kw)
	}

	if kw.ClientInterface == nil {
		return nil, fmt.Errorf("Client must be configured using the {{ .Name }}WatcherConfig or {{ .Name }}WatcherClient")
	}
	return kw, nil
}

func {{ .Name }}WatcherFactory(create func(*tp.{{ .Name }}) interface{}, update func(*tp.{{ .Name }}, interface{}) bool) WatcherOption {
	return func(watcher ResourceWatcher) error {
		w := watcher.(*{{ .Name }}Watcher)
		w.create = create
        w.update = update
        return nil
	}
}

func {{ .Name }}WatcherConfig(config *rest.Config) WatcherOption {
	return func(watcher ResourceWatcher) error {
		w := watcher.(*{{ .Name }}Watcher)

		var cl interface{}
		cl, _  = cp.NewForConfig(config)

		client, ok := cl.(cp.{{ .ClientInterface }})
		if !ok {
			return fmt.Errorf("unexpected type %T", cl)
		}

		w.ClientInterface = client
        return nil
	}
}

// Used to inject the fake client set for testing purposes
func {{ .Name }}WatcherClient(client cp.{{ .ClientInterface }}) WatcherOption {
	return func(watcher ResourceWatcher) error {
		w := watcher.(*{{ .Name }}Watcher)
		w.ClientInterface = client
        return nil
	}
}

func (kw *{{ .Name }}Watcher) Watch() error {
	go func() {
		defer close(kw.stoppedchan)
		defer func() {
			if !kw.watchingStarted {
				close(kw.watching)
			}
		}()
		resource := kw.ClientInterface.{{ .NamePlural }}({{if eq .Scope "namespaced" }}kw.Namespace{{end}})
		log.Printf("{{ .Name }} - Watching")
		running := true
		for running {
			err := kw.doWatch(resource)
			if err != nil {
				log.Printf("{{ .Name }} - Restarting watch")
			} else {
				running = false
			}
		}
		log.Printf("{{ .Name }} - Watching stopped")
	}()

	return nil
}

func (kw *{{ .Name }}Watcher) AwaitWatching() {
	<-kw.watching
}

func (kw *{{ .Name }}Watcher) Shutdown() {
	close(kw.stopchan)
	<-kw.stoppedchan
}

func (kw *{{ .Name }}Watcher) doWatch(resource cp.{{ .Name }}Interface) error {
	resourceList, err := resource.List(v1.ListOptions{})
	if err != nil {
		return err
	}

	keyCreator, err := kw.Cache.GetKeyCreator(cache.PrimaryObjectIndex)
	if err != nil {
		return err
	}
	curr := make(map[string]interface{}, 0)
	_, err = kw.Cache.Get(cache.PrimaryObjectIndex, "{{ .Name }}/", func(obj interface{}) (bool, bool, error) {
		gen, key, err := keyCreator(obj)
		if err != nil {
			return false, false, err
		} else if !gen {
			return false, false, fmt.Errorf("failed to generate key for existing object %+v", obj)
		}
		curr[key] = obj
		return false, true, nil
	})

	var added = 0
	var updated = 0
	var unchanged = 0
	for _, res := range resourceList.Items {
		copy := res.DeepCopy()
		kw.updateKind(copy)

		candidate := kw.create(copy)
		gen, key, err := keyCreator(candidate)
		if err != nil {
			return err
		} else if !gen {
			return fmt.Errorf("failed to generate key for new object %+v", copy)
		}
		if existing, ok := curr[key]; ok {
			err = kw.Cache.Update(func (current interface{}) (interface{}, error) {
				if kw.update(copy, current) {
					updated++
					return copy, nil
				} else {
					unchanged++
					return nil, nil
				}
			}, existing)
			if err != nil {
				return err
			}
			delete(curr, key)
		} else {
			err = kw.Cache.Add(candidate)
			if err != nil {
				return err
			}
			added++
		}
	}

	// Now remove any stale
	for _, stale := range curr {
		err = kw.Cache.Delete(stale)
		if err != nil {
			return err
		}
	}
	var stale = len(curr)

	log.Printf("{{ .Name }} - Cache initialised population added %d, updated %d, unchanged %d, stale %d", added, updated, unchanged, stale)
	resourceWatch, err := resource.Watch(v1.ListOptions{
		ResourceVersion: resourceList.ResourceVersion,
	})

	if ! kw.watchingStarted {
		close(kw.watching)
		kw.watchingStarted = true
	}

	ch := resourceWatch.ResultChan()
	for {
		select {
		case event := <-ch:
			var err error
			if event.Type == watch.Error {
				err = fmt.Errorf("Watch ended in error")
			} else {
				res, ok := event.Object.(*tp.{{ .Name }})
				log.Printf("{{ .Name }} - Received event type %s", event.Type)
				if !ok {
					err = fmt.Errorf("Watch error - object of unexpected type received")
				} else {
					copy := res.DeepCopy()
					kw.updateKind(copy)
					switch event.Type {
					case watch.Added:
						err = kw.Cache.Add(kw.create(copy))
					case watch.Modified:
						updatingKey := kw.create(copy)
						err = kw.Cache.Update(func (current interface{}) (interface{}, error) {
							if kw.update(copy, current) {
								return copy, nil
							} else {
								return nil, nil
							}
						}, updatingKey)
					case watch.Deleted:
						err = kw.Cache.Delete(kw.create(copy))
					}
				}
			}
			if err != nil {
				return err
			}
		case <-kw.stopchan:
			log.Printf("{{ .Name }} - Shutdown received")
			return nil
		}
	}
}

func (kw *{{ .Name }}Watcher) updateKind(o *tp.{{ .Name }}) {
	if o.TypeMeta.Kind == "" {
		o.TypeMeta.Kind = "{{ .Name }}"
	}
}
`))

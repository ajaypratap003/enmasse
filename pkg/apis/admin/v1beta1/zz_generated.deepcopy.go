// +build !ignore_autogenerated

/*
 * Copyright 2018-2019, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

// Code generated by deepcopy-gen. DO NOT EDIT.

package v1beta1

import (
	enmassev1beta1 "github.com/enmasseproject/enmasse/pkg/apis/enmasse/v1beta1"
	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	runtime "k8s.io/apimachinery/pkg/runtime"
)

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *AuthenticationService) DeepCopyInto(out *AuthenticationService) {
	*out = *in
	out.TypeMeta = in.TypeMeta
	in.ObjectMeta.DeepCopyInto(&out.ObjectMeta)
	in.Spec.DeepCopyInto(&out.Spec)
	in.Status.DeepCopyInto(&out.Status)
	return
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new AuthenticationService.
func (in *AuthenticationService) DeepCopy() *AuthenticationService {
	if in == nil {
		return nil
	}
	out := new(AuthenticationService)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyObject is an autogenerated deepcopy function, copying the receiver, creating a new runtime.Object.
func (in *AuthenticationService) DeepCopyObject() runtime.Object {
	if c := in.DeepCopy(); c != nil {
		return c
	}
	return nil
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *AuthenticationServiceList) DeepCopyInto(out *AuthenticationServiceList) {
	*out = *in
	out.TypeMeta = in.TypeMeta
	out.ListMeta = in.ListMeta
	if in.Items != nil {
		in, out := &in.Items, &out.Items
		*out = make([]AuthenticationService, len(*in))
		for i := range *in {
			(*in)[i].DeepCopyInto(&(*out)[i])
		}
	}
	return
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new AuthenticationServiceList.
func (in *AuthenticationServiceList) DeepCopy() *AuthenticationServiceList {
	if in == nil {
		return nil
	}
	out := new(AuthenticationServiceList)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyObject is an autogenerated deepcopy function, copying the receiver, creating a new runtime.Object.
func (in *AuthenticationServiceList) DeepCopyObject() runtime.Object {
	if c := in.DeepCopy(); c != nil {
		return c
	}
	return nil
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *AuthenticationServiceSpec) DeepCopyInto(out *AuthenticationServiceSpec) {
	*out = *in
	if in.Realm != nil {
		in, out := &in.Realm, &out.Realm
		*out = new(string)
		**out = **in
	}
	if in.None != nil {
		in, out := &in.None, &out.None
		*out = new(AuthenticationServiceSpecNone)
		(*in).DeepCopyInto(*out)
	}
	if in.Standard != nil {
		in, out := &in.Standard, &out.Standard
		*out = new(AuthenticationServiceSpecStandard)
		(*in).DeepCopyInto(*out)
	}
	if in.External != nil {
		in, out := &in.External, &out.External
		*out = new(AuthenticationServiceSpecExternal)
		(*in).DeepCopyInto(*out)
	}
	return
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new AuthenticationServiceSpec.
func (in *AuthenticationServiceSpec) DeepCopy() *AuthenticationServiceSpec {
	if in == nil {
		return nil
	}
	out := new(AuthenticationServiceSpec)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *AuthenticationServiceSpecExternal) DeepCopyInto(out *AuthenticationServiceSpecExternal) {
	*out = *in
	if in.CaCertSecret != nil {
		in, out := &in.CaCertSecret, &out.CaCertSecret
		*out = new(v1.SecretReference)
		**out = **in
	}
	if in.ClientCertSecret != nil {
		in, out := &in.ClientCertSecret, &out.ClientCertSecret
		*out = new(v1.SecretReference)
		**out = **in
	}
	return
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new AuthenticationServiceSpecExternal.
func (in *AuthenticationServiceSpecExternal) DeepCopy() *AuthenticationServiceSpecExternal {
	if in == nil {
		return nil
	}
	out := new(AuthenticationServiceSpecExternal)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *AuthenticationServiceSpecNone) DeepCopyInto(out *AuthenticationServiceSpecNone) {
	*out = *in
	if in.CertificateSecret != nil {
		in, out := &in.CertificateSecret, &out.CertificateSecret
		*out = new(v1.SecretReference)
		**out = **in
	}
	if in.Image != nil {
		in, out := &in.Image, &out.Image
		*out = new(enmassev1beta1.ImageOverride)
		**out = **in
	}
	if in.Resources != nil {
		in, out := &in.Resources, &out.Resources
		*out = new(v1.ResourceRequirements)
		(*in).DeepCopyInto(*out)
	}
	return
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new AuthenticationServiceSpecNone.
func (in *AuthenticationServiceSpecNone) DeepCopy() *AuthenticationServiceSpecNone {
	if in == nil {
		return nil
	}
	out := new(AuthenticationServiceSpecNone)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *AuthenticationServiceSpecStandard) DeepCopyInto(out *AuthenticationServiceSpecStandard) {
	*out = *in
	if in.CredentialsSecret != nil {
		in, out := &in.CredentialsSecret, &out.CredentialsSecret
		*out = new(v1.SecretReference)
		**out = **in
	}
	if in.CertificateSecret != nil {
		in, out := &in.CertificateSecret, &out.CertificateSecret
		*out = new(v1.SecretReference)
		**out = **in
	}
	if in.ServiceAccountName != nil {
		in, out := &in.ServiceAccountName, &out.ServiceAccountName
		*out = new(string)
		**out = **in
	}
	if in.DeploymentName != nil {
		in, out := &in.DeploymentName, &out.DeploymentName
		*out = new(string)
		**out = **in
	}
	if in.ServiceName != nil {
		in, out := &in.ServiceName, &out.ServiceName
		*out = new(string)
		**out = **in
	}
	if in.RouteName != nil {
		in, out := &in.RouteName, &out.RouteName
		*out = new(string)
		**out = **in
	}
	if in.Image != nil {
		in, out := &in.Image, &out.Image
		*out = new(enmassev1beta1.ImageOverride)
		**out = **in
	}
	if in.InitImage != nil {
		in, out := &in.InitImage, &out.InitImage
		*out = new(enmassev1beta1.ImageOverride)
		**out = **in
	}
	if in.JvmOptions != nil {
		in, out := &in.JvmOptions, &out.JvmOptions
		*out = new(string)
		**out = **in
	}
	if in.Resources != nil {
		in, out := &in.Resources, &out.Resources
		*out = new(v1.ResourceRequirements)
		(*in).DeepCopyInto(*out)
	}
	if in.Storage != nil {
		in, out := &in.Storage, &out.Storage
		*out = new(AuthenticationServiceSpecStandardStorage)
		(*in).DeepCopyInto(*out)
	}
	if in.Datasource != nil {
		in, out := &in.Datasource, &out.Datasource
		*out = new(AuthenticationServiceSpecStandardDatasource)
		**out = **in
	}
	if in.SecurityContext != nil {
		in, out := &in.SecurityContext, &out.SecurityContext
		*out = new(v1.PodSecurityContext)
		(*in).DeepCopyInto(*out)
	}
	return
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new AuthenticationServiceSpecStandard.
func (in *AuthenticationServiceSpecStandard) DeepCopy() *AuthenticationServiceSpecStandard {
	if in == nil {
		return nil
	}
	out := new(AuthenticationServiceSpecStandard)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *AuthenticationServiceSpecStandardDatasource) DeepCopyInto(out *AuthenticationServiceSpecStandardDatasource) {
	*out = *in
	out.CredentialsSecret = in.CredentialsSecret
	return
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new AuthenticationServiceSpecStandardDatasource.
func (in *AuthenticationServiceSpecStandardDatasource) DeepCopy() *AuthenticationServiceSpecStandardDatasource {
	if in == nil {
		return nil
	}
	out := new(AuthenticationServiceSpecStandardDatasource)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *AuthenticationServiceSpecStandardStorage) DeepCopyInto(out *AuthenticationServiceSpecStandardStorage) {
	*out = *in
	if in.Class != nil {
		in, out := &in.Class, &out.Class
		*out = new(string)
		**out = **in
	}
	if in.ClaimName != nil {
		in, out := &in.ClaimName, &out.ClaimName
		*out = new(string)
		**out = **in
	}
	if in.Selector != nil {
		in, out := &in.Selector, &out.Selector
		*out = new(metav1.LabelSelector)
		(*in).DeepCopyInto(*out)
	}
	if in.DeleteClaim != nil {
		in, out := &in.DeleteClaim, &out.DeleteClaim
		*out = new(bool)
		**out = **in
	}
	out.Size = in.Size.DeepCopy()
	return
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new AuthenticationServiceSpecStandardStorage.
func (in *AuthenticationServiceSpecStandardStorage) DeepCopy() *AuthenticationServiceSpecStandardStorage {
	if in == nil {
		return nil
	}
	out := new(AuthenticationServiceSpecStandardStorage)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *AuthenticationServiceStatus) DeepCopyInto(out *AuthenticationServiceStatus) {
	*out = *in
	if in.CaCertSecret != nil {
		in, out := &in.CaCertSecret, &out.CaCertSecret
		*out = new(v1.SecretReference)
		**out = **in
	}
	if in.ClientCertSecret != nil {
		in, out := &in.ClientCertSecret, &out.ClientCertSecret
		*out = new(v1.SecretReference)
		**out = **in
	}
	return
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new AuthenticationServiceStatus.
func (in *AuthenticationServiceStatus) DeepCopy() *AuthenticationServiceStatus {
	if in == nil {
		return nil
	}
	out := new(AuthenticationServiceStatus)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ConsoleService) DeepCopyInto(out *ConsoleService) {
	*out = *in
	out.TypeMeta = in.TypeMeta
	in.ObjectMeta.DeepCopyInto(&out.ObjectMeta)
	in.Spec.DeepCopyInto(&out.Spec)
	in.Status.DeepCopyInto(&out.Status)
	return
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ConsoleService.
func (in *ConsoleService) DeepCopy() *ConsoleService {
	if in == nil {
		return nil
	}
	out := new(ConsoleService)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyObject is an autogenerated deepcopy function, copying the receiver, creating a new runtime.Object.
func (in *ConsoleService) DeepCopyObject() runtime.Object {
	if c := in.DeepCopy(); c != nil {
		return c
	}
	return nil
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ConsoleServiceList) DeepCopyInto(out *ConsoleServiceList) {
	*out = *in
	out.TypeMeta = in.TypeMeta
	out.ListMeta = in.ListMeta
	if in.Items != nil {
		in, out := &in.Items, &out.Items
		*out = make([]ConsoleService, len(*in))
		for i := range *in {
			(*in)[i].DeepCopyInto(&(*out)[i])
		}
	}
	return
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ConsoleServiceList.
func (in *ConsoleServiceList) DeepCopy() *ConsoleServiceList {
	if in == nil {
		return nil
	}
	out := new(ConsoleServiceList)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyObject is an autogenerated deepcopy function, copying the receiver, creating a new runtime.Object.
func (in *ConsoleServiceList) DeepCopyObject() runtime.Object {
	if c := in.DeepCopy(); c != nil {
		return c
	}
	return nil
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ConsoleServiceSpec) DeepCopyInto(out *ConsoleServiceSpec) {
	*out = *in
	if in.Replicas != nil {
		in, out := &in.Replicas, &out.Replicas
		*out = new(int32)
		**out = **in
	}
	if in.DiscoveryMetadataURL != nil {
		in, out := &in.DiscoveryMetadataURL, &out.DiscoveryMetadataURL
		*out = new(string)
		**out = **in
	}
	if in.Scope != nil {
		in, out := &in.Scope, &out.Scope
		*out = new(string)
		**out = **in
	}
	if in.OauthClientSecret != nil {
		in, out := &in.OauthClientSecret, &out.OauthClientSecret
		*out = new(v1.SecretReference)
		**out = **in
	}
	if in.CertificateSecret != nil {
		in, out := &in.CertificateSecret, &out.CertificateSecret
		*out = new(v1.SecretReference)
		**out = **in
	}
	if in.SsoCookieSecret != nil {
		in, out := &in.SsoCookieSecret, &out.SsoCookieSecret
		*out = new(v1.SecretReference)
		**out = **in
	}
	if in.SsoCookieDomain != nil {
		in, out := &in.SsoCookieDomain, &out.SsoCookieDomain
		*out = new(string)
		**out = **in
	}
	if in.Host != nil {
		in, out := &in.Host, &out.Host
		*out = new(string)
		**out = **in
	}
	return
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ConsoleServiceSpec.
func (in *ConsoleServiceSpec) DeepCopy() *ConsoleServiceSpec {
	if in == nil {
		return nil
	}
	out := new(ConsoleServiceSpec)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ConsoleServiceStatus) DeepCopyInto(out *ConsoleServiceStatus) {
	*out = *in
	if in.CaCertSecret != nil {
		in, out := &in.CaCertSecret, &out.CaCertSecret
		*out = new(v1.SecretReference)
		**out = **in
	}
	return
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ConsoleServiceStatus.
func (in *ConsoleServiceStatus) DeepCopy() *ConsoleServiceStatus {
	if in == nil {
		return nil
	}
	out := new(ConsoleServiceStatus)
	in.DeepCopyInto(out)
	return out
}

/*
 * Copyright 2018, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
package io.enmasse.systemtest.selenium.resources;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class ConnectionWebItem extends WebItem implements Comparable<ConnectionWebItem> {
    private String host;
    private String containerId;
    private String protocol;
    private int messagesIn;
    private int messagesOut;
    private int senders;
    private int receivers;

    public ConnectionWebItem(WebElement item) {
        this.webItem = item;
        this.host = parseName(webItem.findElement(By.xpath("./td[@data-label='host']")));
        this.containerId = webItem.findElement(By.xpath("./td[@data-label='Container ID']")).getText();
        this.protocol = webItem.findElement(By.xpath("./td[@data-label='Protocol']")).getText().split(" ")[0];
        this.messagesIn = Integer.parseInt(webItem.findElement(By.xpath("./td[@data-label='column-3']")).getText());
        this.messagesOut = Integer.parseInt(webItem.findElement(By.xpath("./td[@data-label='column-4']")).getText());
        this.senders = Integer.parseInt(webItem.findElement(By.xpath("./td[@data-label='Senders']")).getText());
        this.receivers = Integer.parseInt(webItem.findElement(By.xpath("./td[@data-label='Receivers']")).getText());
    }

    public String getHost() {
        return host;
    }

    public String getContainerId() {
        return containerId;
    }

    public String getProtocol() {
        return protocol;
    }

    public int getMessagesIn() {
        return messagesIn;
    }

    public int getMessagesOut() {
        return messagesOut;
    }

    public int getSenders() {
        return senders;
    }

    public int getReceivers() {
        return receivers;
    }

    private String parseName(WebElement elem) {
        try {
            return elem.findElement(By.tagName("a")).getText();
        } catch (Exception ex) {
            return elem.findElements(By.tagName("p")).get(0).getText();
        }
    }

    @Override
    public String toString() {
        return String.format("host: %s, containerId: %s, messagesIn: %d, messagesOut: %d, senders: %d, receivers: %d",
                this.host,
                this.containerId,
                this.messagesIn,
                this.messagesOut,
                this.senders,
                this.receivers);
    }

    @Override
    public int compareTo(ConnectionWebItem o) {
        return host.compareTo(o.host);
    }
}

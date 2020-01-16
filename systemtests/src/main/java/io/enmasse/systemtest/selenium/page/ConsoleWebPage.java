/*
 * Copyright 2019, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
package io.enmasse.systemtest.selenium.page;

import io.enmasse.address.model.Address;
import io.enmasse.address.model.AddressSpace;
import io.enmasse.systemtest.UserCredentials;
import io.enmasse.systemtest.logs.CustomLogger;
import io.enmasse.systemtest.model.address.AddressType;
import io.enmasse.systemtest.model.addressspace.AddressSpaceType;
import io.enmasse.systemtest.selenium.SeleniumProvider;
import io.enmasse.systemtest.selenium.resources.AddressSpaceWebItem;
import io.enmasse.systemtest.selenium.resources.AddressWebItem;
import io.enmasse.systemtest.selenium.resources.ClientWebItem;
import io.enmasse.systemtest.selenium.resources.ConnectionWebItem;
import io.enmasse.systemtest.selenium.resources.FilterType;
import io.enmasse.systemtest.time.TimeoutBudget;
import io.enmasse.systemtest.utils.AddressSpaceUtils;
import io.enmasse.systemtest.utils.AddressUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.slf4j.Logger;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class ConsoleWebPage implements IWebPage {

    private static Logger log = CustomLogger.getLogger();

    SeleniumProvider selenium;
    String ocRoute;
    UserCredentials credentials;
    OpenshiftLoginWebPage loginPage;

    public ConsoleWebPage(SeleniumProvider selenium, String ocRoute, UserCredentials credentials) {
        this.selenium = selenium;
        this.ocRoute = ocRoute;
        this.credentials = credentials;
        this.loginPage = new OpenshiftLoginWebPage(selenium);
    }

    //================================================================================================
    // Getters and finders of elements and data
    //================================================================================================

    private WebElement getAddressTab() {
        return getContentElem().findElement(By.id("ad-space-nav-addresses"));
    }

    private WebElement getConnectionTab() {
        return getContentElem().findElement(By.id("ad-space-nav-connections"));
    }

    // Table selectors
    private WebElement getContentElem() {
        return selenium.getDriver().findElement(By.id("main-container"));
    }

    private WebElement getCreateButtonTop() {
        return selenium.getDriver().findElement(By.id("al-filter-overflow-button"));
    }

    private WebElement getCreateButtonEmptyPage() {
        return selenium.getDriver().findElement(By.id("empty-ad-space-create-button"));
    }

    private WebElement getAddressSpaceTable() {
        return selenium.getDriver().findElement(By.xpath("//table[@aria-label='address space list']"));
    }

    private WebElement getTableAddressSpaceHeader() {
        return getAddressSpaceTable().findElement(By.id("aslist-table-header"));
    }

    private WebElement getAddressSpaceList() {
        return getAddressSpaceTable().findElement(By.tagName("tbody"));
    }

    private WebElement getAddressTable() {
        return selenium.getDriver().findElement(By.xpath("//table[@aria-label='Address List']"));
    }

    private WebElement getTableAddressHeader() {
        return getAddressSpaceTable().findElement(By.id("aslist-table-header"));
    }

    private WebElement getTableAddressList() {
        return getAddressTable().findElement(By.tagName("tbody"));
    }

    private WebElement getConnectionTable() {
        return selenium.getDriver().findElement(By.xpath("//table[@aria-label='connection list']"));
    }

    private WebElement getTableConnectionHeader() {
        return getConnectionTable().findElement(By.id("aslist-table-header"));
    }

    private WebElement getTableClientsList() {
        return getClientsTable().findElement(By.tagName("tbody"));
    }

    private WebElement getClientsTable() {
        return selenium.getDriver().findElement(By.xpath("//table[@aria-label='client list']"));
    }

    private WebElement getTableClientsHeader() {
        return getClientsTable().findElement(By.id("aslist-table-header"));
    }

    private WebElement getTableConnectionList() {
        return getAddressTable().findElement(By.tagName("tbody"));
    }
    //==============================================================

    //Items selectors
    public List<AddressSpaceWebItem> getAddressSpaceItems() {
        List<WebElement> elements = getAddressSpaceList().findElements(By.tagName("tr"));
        List<AddressSpaceWebItem> addressSpaceItems = new ArrayList<>();
        for (WebElement element : elements) {
            AddressSpaceWebItem addressSpace = new AddressSpaceWebItem(element);
            log.info(String.format("Got addressSpace: %s", addressSpace.toString()));
            addressSpaceItems.add(addressSpace);
        }
        return addressSpaceItems;
    }

    public AddressSpaceWebItem getAddressSpaceItem(AddressSpace as) {
        AddressSpaceWebItem returnedElement = null;
        List<AddressSpaceWebItem> addressWebItems = getAddressSpaceItems();
        for (AddressSpaceWebItem item : addressWebItems) {
            if (item.getName().equals(as.getMetadata().getName()) && item.getNamespace().equals(as.getMetadata().getNamespace()))
                returnedElement = item;
        }
        return returnedElement;
    }

    public List<AddressWebItem> getAddressItems() {
        List<WebElement> elements = getTableAddressList().findElements(By.tagName("tr"));
        List<AddressWebItem> addressSpaceItems = new ArrayList<>();
        for (WebElement element : elements) {
            AddressWebItem address = new AddressWebItem(element);
            log.info(String.format("Got address: %s", address.toString()));
            addressSpaceItems.add(address);
        }
        return addressSpaceItems;
    }

    public AddressWebItem getAddressItem(Address as) {
        AddressWebItem returnedElement = null;
        List<AddressWebItem> addressWebItems = getAddressItems();
        for (AddressWebItem item : addressWebItems) {
            if (item.getAddress().equals(as.getSpec().getAddress()))
                returnedElement = item;
        }
        return returnedElement;
    }

    public List<ConnectionWebItem> getConnectionItems() {
        List<WebElement> elements = getTableConnectionList().findElements(By.tagName("tr"));
        List<ConnectionWebItem> connections = new ArrayList<>();
        for (WebElement element : elements) {
            ConnectionWebItem connection = new ConnectionWebItem(element);
            log.info(String.format("Got connection: %s", connection.toString()));
            connections.add(connection);
        }
        return connections;
    }

    public ConnectionWebItem getConnectionItem(String host) {
        ConnectionWebItem returnedElement = null;
        List<ConnectionWebItem> connections = getConnectionItems();
        for (ConnectionWebItem item : connections) {
            if (item.getHost().equals(host))
                returnedElement = item;
        }
        return returnedElement;
    }

    public List<ClientWebItem> getClientItems() {
        List<WebElement> elements = getTableClientsList().findElements(By.tagName("tr"));
        List<ClientWebItem> clients = new ArrayList<>();
        for (WebElement element : elements) {
            ClientWebItem client = new ClientWebItem(element);
            log.info(String.format("Got client: %s", client.toString()));
            clients.add(client);
        }
        return clients;
    }

    public ClientWebItem getClientItem(String containerId) {
        ClientWebItem returnedElement = null;
        List<ClientWebItem> clients = getClientItems();
        for (ClientWebItem item : clients) {
            if (item.getContainerId().equals(containerId))
                returnedElement = item;
        }
        return returnedElement;
    }
    //==============================================================

    //Form selectors
    private WebElement getDeleteAllButton() {
        return getContentElem().findElement(By.id("al-filter-overflow-dropdown"))
                .findElement(By.xpath("./button[contains(text(), 'Delete All')]"));
    }

    private WebElement getNamespaceDropDown() {
        return selenium.getDriver().findElement(By.id("cas-dropdown-namespace"));
    }

    private WebElement getAuthServiceDropDown() {
        return selenium.getDriver().findElement(By.id("cas-dropdown-auth-service"));
    }

    private WebElement getAddressSpaceNameInput() {
        return selenium.getDriver().findElement(By.id("address-space"));
    }

    private WebElement getBrokeredRadioButton() {
        return selenium.getDriver().findElement(By.id("cas-brokered-radio"));
    }

    private WebElement getStandardRadioButton() {
        return selenium.getDriver().findElement(By.id("cas-standard-radio"));
    }

    private WebElement getPlanDropDown() {
        return selenium.getDriver().findElement(By.id("cas-dropdown-plan"));
    }

    private WebElement getNextButton() {
        return selenium.getDriver().findElement(By.xpath("//button[contains(text(), 'Next')]"));
    }

    private WebElement getCancelButton() {
        return selenium.getDriver().findElement(By.xpath("//button[contains(text(), 'Cancel')]"));
    }

    private WebElement getFinishButton() {
        return selenium.getDriver().findElement(By.xpath("//button[contains(text(), 'Finish')]"));
    }

    private WebElement getBackButton() {
        return selenium.getDriver().findElement(By.xpath("//button[contains(text(), 'Back')]"));
    }

    private WebElement getConfirmButton() {
        return selenium.getDriver().findElement(By.xpath("//button[contains(text(), 'Confirm')]"));
    }

    private WebElement getAddressNameInput() {
        return selenium.getDriver().findElement(By.id("address-name"));
    }

    private WebElement getAddressPlanDropDown() {
        return selenium.getDriver().findElement(By.id("address-definition-plan-dropdown"));
    }

    private WebElement getAddressTypeDropDown() {
        return selenium.getDriver().findElement(By.id("address-definition-type-dropdown"));
    }

    private WebElement getTopicSelectDropDown() {
        return selenium.getDriver().findElement(By.id("address-definition-topic-dropdown"));
    }

    //Filter selectors
    private WebElement getToolBarMenu() throws Exception {
        return selenium.getWebElement(() -> getContentElem().findElement(By.id("data-toolbar-with-filter")));
    }

    private WebElement getAddressFilterDropDown() throws Exception {
        return getToolBarMenu().findElement(By.id("al-filter-dropdown"));
    }

    private WebElement getConnectionFilterDropDown() throws Exception {
        return getToolBarMenu().findElement(By.id("cl-filter-dropdown"));
    }

    private WebElement getSelectNameTextBox() throws Exception {
        return getToolBarMenu().findElement(By.id("select-typeahead"));
    }

    private WebElement getSelectTypeDropDown() throws Exception {
        return getToolBarMenu().findElement(By.id("al-filter-select-type-dropdown"));
    }

    private WebElement getSelectStatusDropDown() throws Exception {
        return getToolBarMenu().findElement(By.id("al-filter-select-status-dropdown"));
    }

    private WebElement getTypeFilterDropDownItem() throws Exception {
        return getAddressFilterDropDown().findElement(By.id("al-filter-dropdownfilterType"));
    }

    private WebElement getStatusFilterDropDownItem() throws Exception {
        return getAddressFilterDropDown().findElement(By.id("al-filter-dropdownfilterStatus"));
    }

    private WebElement getAddressFilterDropDownItem() throws Exception {
        return getAddressFilterDropDown().findElement(By.id("al-filter-dropdownfilterAddress"));
    }

    private WebElement getSearchButton() throws Exception {
        return getToolBarMenu().findElement(By.id("al-filter-select-name-search"));
    }

    private WebElement getAppliedFilterBar() throws Exception {
        return getToolBarMenu().findElements(By.className("pf-c-data-toolbar__content")).get(1); //TODO use id when will be implemented
    }

    private List<WebElement> getAppliedFilterItems() throws Exception {
        return getAppliedFilterBar().findElements(By.className("pf-m-toolbar")); //TODO use id when will be implemented
    }

    private WebElement getAppliedFilterItem(FilterType filterType, String filterValue) throws Exception {
        List<WebElement> filters = getAppliedFilterItems();
        for (WebElement filter : filters) {
            String typeOfFilter = filter.findElement(By.tagName("h4")).getText().toLowerCase();
            String itemFilterValue = filter.findElement(By.tagName("span")).getText().toLowerCase();
            if (typeOfFilter.equals(filterType.toString()) && itemFilterValue.equals(filterValue.toLowerCase())) {
                return filter.findElement(By.tagName("button"));
            }
        }
        return null;
    }
    //==================================================================


    //================================================================================================
    // Operations
    //================================================================================================

    public void openConsolePage() throws Exception {
        log.info("Opening global console on route {}", ocRoute);
        selenium.getDriver().get(ocRoute);
        if (waitUntilLoginPage()) {
            selenium.getAngularDriver().waitForAngularRequestsToFinish();
            selenium.takeScreenShot();
            try {
                logout();
            } catch (Exception ex) {
                log.info("User is not logged");
            }
            if (!login())
                throw new IllegalAccessException(loginPage.getAlertMessage());
        }
        selenium.getAngularDriver().waitForAngularRequestsToFinish();
        if (!waitUntilConsolePage()) {
            throw new IllegalStateException("Openshift console not loaded");
        }
    }

    public void openAddressList(AddressSpace addressSpace) throws Exception {
        AddressSpaceWebItem item = selenium.waitUntilItemPresent(30, () -> getAddressSpaceItem(addressSpace));
        selenium.clickOnItem(item.getConsoleRoute());
        selenium.getWebElement(this::getAddressTable);
    }

    public void openConnectionList(AddressSpace addressSpace) throws Exception {
        AddressSpaceWebItem item = selenium.waitUntilItemPresent(30, () -> getAddressSpaceItem(addressSpace));
        selenium.clickOnItem(item.getConsoleRoute());
        switchToConnectionTab();
        selenium.getWebElement(this::getConnectionTable);
    }

    public void openClientsList(Address address) throws Exception {
        AddressWebItem item = selenium.waitUntilItemPresent(30, () -> getAddressItem(address));
        selenium.clickOnItem(item.getClientsRoute(), "Clients route");
        selenium.getWebElement(this::getClientsTable);
    }

    private void selectNamespace(String namespace) throws Exception {
        selenium.clickOnItem(getNamespaceDropDown(), "namespace dropdown");
        selenium.clickOnItem(selenium.getDriver().findElement(By.xpath("//button[@value='" + namespace + "']")), namespace);
    }

    private void selectPlan(String plan) throws Exception {
        selenium.clickOnItem(getPlanDropDown(), "address space plan dropdown");
        selenium.clickOnItem(selenium.getDriver().findElement(By.xpath("//button[@value='" + plan + "']")), plan);
    }

    private void selectAuthService(String authService) throws Exception {
        selenium.clickOnItem(getAuthServiceDropDown(), "address space plan dropdown");
        selenium.clickOnItem(selenium.getDriver().findElement(By.xpath("//button[@value='" + authService + "']")), authService);
    }

    public void createAddressSpace(AddressSpace addressSpace) throws Exception {
        selenium.clickOnItem(getCreateButtonTop());
        selectNamespace(addressSpace.getMetadata().getNamespace());
        selenium.fillInputItem(getAddressSpaceNameInput(), addressSpace.getMetadata().getName());
        selenium.clickOnItem(addressSpace.getSpec().getType().equals(AddressSpaceType.BROKERED.toString().toLowerCase()) ? getBrokeredRadioButton() : getStandardRadioButton(),
                addressSpace.getSpec().getType());
        selectPlan(addressSpace.getSpec().getPlan());
        selectAuthService(addressSpace.getSpec().getAuthenticationService().getName());
        selenium.clickOnItem(getNextButton());
        selenium.clickOnItem(getFinishButton());
        selenium.waitUntilItemPresent(30, () -> getAddressSpaceItem(addressSpace));
        selenium.takeScreenShot();
        AddressSpaceUtils.waitForAddressSpaceReady(addressSpace);
        selenium.refreshPage();
    }

    public void deleteAddressSpace(AddressSpace addressSpace) throws Exception {
        AddressSpaceWebItem item = selenium.waitUntilItemPresent(30, () -> getAddressSpaceItem(addressSpace));
        selenium.clickOnItem(item.getActionDropDown(), "Address space dropdown");
        selenium.clickOnItem(item.getDeleteMenuItem());
        selenium.clickOnItem(getConfirmButton());
        selenium.waitUntilItemNotPresent(30, () -> getAddressSpaceItem(addressSpace));
    }

    public void switchAddressSpacePlan(AddressSpace addressSpace, String addressSpacePlan) throws Exception {
        AddressSpaceWebItem item = selenium.waitUntilItemPresent(30, () -> getAddressSpaceItem(addressSpace));
        selenium.clickOnItem(item.getActionDropDown(), "Address space dropdown");
        selenium.clickOnItem(item.getEditMenuItem());
        selenium.clickOnItem(selenium.getDriver().findElement(By.id("edit-addr-plan")));
        selenium.clickOnItem(selenium.getDriver()
                .findElement(By.xpath("//option[@value='" + addressSpacePlan + "']")));
        selenium.clickOnItem(selenium.getDriver().findElement(By.id("as-list-edit-confirm")));
        selenium.refreshPage();
        addressSpace.getSpec().setPlan(addressSpacePlan);
    }

    public void createAddressesAndWait(Address... addresses) throws Exception {
        for (Address address : addresses) {
            createAddress(address, false);
        }
        AddressUtils.waitForDestinationsReady(addresses);
    }

    public void createAddresses(Address... addresses) throws Exception {
        for (Address address : addresses) {
            createAddress(address, false);
        }
    }

    public void createAddress(Address address) throws Exception {
        createAddress(address, true);
    }

    public void createAddress(Address address, boolean waitForReady) throws Exception {
        log.info("Address {} will be created using web console", address);
        selenium.clickOnItem(getCreateButtonTop());
        selenium.fillInputItem(getAddressNameInput(), address.getSpec().getAddress());
        selenium.clickOnItem(getAddressTypeDropDown(), "Address Type dropdown");
        selenium.clickOnItem(getAddressTypeDropDown().findElement(By.id("address-definition-type-dropdown-item" + address.getSpec().getType())));
        selenium.clickOnItem(getAddressPlanDropDown(), "address plan dropdown");
        selenium.clickOnItem(getAddressPlanDropDown().findElement(By.id("address-definition-plan-dropdown-item" + address.getSpec().getPlan())));
        if (address.getSpec().getType().equals(AddressType.SUBSCRIPTION.toString())) {
            selenium.clickOnItem(getTopicSelectDropDown(), "topic dropdown");
            selenium.clickOnItem(getTopicSelectDropDown().findElement(By.id("address-definition-topic-dropdown-item" + AddressUtils.getAddressSpaceNameFromAddress(address) + "." + address.getSpec().getTopic())));
        }
        selenium.clickOnItem(getNextButton());
        selenium.clickOnItem(getFinishButton());
        selenium.waitUntilItemPresent(30, () -> getAddressItem(address));
        if (waitForReady) {
            AddressUtils.waitForDestinationsReady(address);
        }
    }

    public void deleteAddress(Address dest) throws Exception {
        log.info("Address {} will be deleted using web console", dest);
        AddressWebItem item = getAddressItem(dest);
        selenium.clickOnItem(item.getActionDropDown(), "Address item menu");
        selenium.clickOnItem(item.getDeleteMenuItem());
        selenium.clickOnItem(getConfirmButton());
        selenium.waitUntilItemNotPresent(30, () -> getAddressItem(dest));
        AddressUtils.waitForAddressDeleted(dest, new TimeoutBudget(5, TimeUnit.MINUTES));
    }

    public void switchToAddressTab() {
        selenium.clickOnItem(getAddressTab(), "Addresses");
    }

    public void switchToConnectionTab() {
        selenium.clickOnItem(getConnectionTab(), "Connections");
    }

    public void addAddressesFilter(FilterType filterType, String filterValue) throws Exception {
        log.info("Apply filter {} type {}", filterValue, filterType);
        selenium.clickOnItem(getAddressFilterDropDown(), "Address filter dropdown");
        switch (filterType) {
            case ADDRESS:
                selenium.clickOnItem(getAddressFilterDropDownItem());
                selenium.fillInputItem(getSelectNameTextBox(), filterValue);
                selenium.clickOnItem(getSearchButton(), "Search");
                break;
            case STATUS:
                selenium.clickOnItem(getStatusFilterDropDownItem());
                selenium.clickOnItem(getSelectStatusDropDown(), "Status phase dropdown");
                selenium.clickOnItem(getSelectStatusDropDown()
                        .findElement(By.id("al-filter-select-status-dropdown-itemstatus" + filterValue.substring(0, 1).toUpperCase() + filterValue.substring(1))));
                break;
            case TYPE:
                selenium.clickOnItem(getTypeFilterDropDownItem());
                selenium.clickOnItem(getSelectTypeDropDown(), "Type filter dropdown");
                selenium.clickOnItem(getSelectTypeDropDown()
                        .findElement(By.id("al-filter-select-type-dropdown-itemtype" + filterValue.substring(0, 1).toUpperCase() + filterValue.substring(1))));
                break;
        }
    }

    public void removeAllFilters() throws Exception {
        log.info("Clear all filters");
        selenium.clickOnItem(getToolBarMenu().findElements(By.tagName("button")).stream().filter(webElement -> webElement.getText().contains("Clear all filters")).findAny().get());
    }

    public void removeAddressFilter(FilterType filterType, String filterValue) throws Exception {
        log.info("Removing filter {} type {}", filterValue, filterType);
        selenium.clickOnItem(getAppliedFilterItem(filterType, filterValue), "delete filter");
    }

    //================================================================================================
    // Login
    //================================================================================================

    private boolean login() throws Exception {
        return loginPage.login(credentials.getUsername(), credentials.getPassword());
    }

    public void logout() {
        try {
            WebElement userDropdown = selenium.getDriver().findElement(By.id("dd-user"));
            selenium.clickOnItem(userDropdown, "User dropdown navigation");
            WebElement logout = selenium.getDriver().findElement(By.id("dd-menuitem-logout"));
            selenium.clickOnItem(logout, "Log out");
        } catch (Exception ex) {
            log.info("Unable to logout, user is not logged in");
        }
    }

    private boolean waitUntilLoginPage() {
        try {
            selenium.getDriverWait().withTimeout(Duration.ofSeconds(3)).until(ExpectedConditions.titleContains("Log"));
            selenium.clickOnItem(selenium.getDriver().findElement(By.tagName("button")));
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    private boolean waitUntilConsolePage() {
        try {
            selenium.getDriverWait().until(ExpectedConditions.visibilityOfElementLocated(By.id("root")));
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    @Override
    public void checkReachableWebPage() {
        selenium.getDriverWait().withTimeout(Duration.ofSeconds(60)).until(ExpectedConditions.or(
                ExpectedConditions.presenceOfElementLocated(By.id("root")),
                ExpectedConditions.titleContains("Address Space List")
        ));
    }
}

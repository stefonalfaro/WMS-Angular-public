import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_helpers/auth.guard';

import {AdminPanelComponent} from './admin-panel/admin-panel.component';
import { UsersComponent } from './admin-panel/users/users.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {InboundShipmentsComponent} from './inbound-shipments/inbound-shipments.component';
import {IntegrationsComponent} from './integrations/integrations.component';
import {InventoryComponent} from './inventory/inventory.component';
import {MasterInventoryComponent} from './master-inventory/master-inventory.component';
import {OrdersComponent} from './orders/orders.component';
import {ReportsComponent} from './reports/reports.component';
import {TransactionsComponent} from './transactions/transactions.component';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {WarehousesComponent} from './warehouses/warehouses.component';
import { PlaceOrderComponent } from './orders/place-order/place-order.component';
import { PlaceInboundShipmentComponent } from './inbound-shipments/place-inbound-shipment/place-inbound-shipment.component';
import { UnitsOfMeasuresComponent } from './master-inventory/units-of-measures/units-of-measures.component';
import { WebhooksComponent } from './integrations/webhooks/webhooks.component';
import { CsvImportsComponent } from './integrations/csv-imports/csv-imports.component';
import { CsvExportsComponent } from './integrations/csv-exports/csv-exports.component';
import { ClientsComponent } from './admin-panel/clients/clients.component';
import {LoginComponent} from './login/login.component';
import { CustomersComponent } from './accounts/customers/customers.component';
import { VendorsComponent } from './accounts/vendors/vendors.component';
import { AllocationsComponent } from './allocations/allocations.component';
import { AddEditAllocationComponent } from './allocations/add-edit-allocation/add-edit-allocation.component';
import { MasterSerialsComponent } from './master-inventory/master-serials/master-serials.component';
import { LocationsComponent } from './locations/locations.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { GenerateLocationLabelsComponent } from './admin-panel/generate-location-labels/generate-location-labels.component';
import { AutoBillingComponent } from './admin-panel/auto-billing/auto-billing.component';
import { ResourcesComponent } from './resources/resources.component';
import { KitsComponent } from './kits/kits.component';
import { GShipComponent } from './gship/gship.component';
import { ViewGshipComponent } from './gship/view-gship/view-gship.component';
import {EventLogComponent} from './admin-panel/event-log/event-log.component';
import { PickupsComponent } from './gship/pickups/pickups.component';
import { AddEditPickupComponent } from './gship/pickups/add-edit-pickup/add-edit-pickup.component';


const routes: Routes = [
  {path:'Login', component:LoginComponent, data:{title:"Login"}},
  {path:'', canActivate: [AuthGuard], component:DashboardComponent, data:{title:"Dashboard"}},
  //{path:':SelectedWarehouseId', canActivate: [AuthGuard], component:DashboardComponent, data:{title:"Dashboard"}},
  {path:'AdminPanel', canActivate: [AuthGuard], component:AdminPanelComponent, data: {title: 'Admin Panel'}},
  {path:'EventLog', canActivate: [AuthGuard], component:EventLogComponent, data: {title: 'Event Log'}},
  {path:'LocationLabels', canActivate: [AuthGuard], component:GenerateLocationLabelsComponent, data: {title: 'Location Labels'}},
  {path:'AutoBilling', canActivate: [AuthGuard], component:AutoBillingComponent, data: {title: 'Auto Billing'}},
  {path:'Resources', canActivate: [AuthGuard], component:ResourcesComponent, data:{title:'Resources'}},
  {path:'AdminPanel/:Module',canActivate: [AuthGuard], component:AdminPanelComponent, data: {title: 'Admin Panel'}},
  {path:'InboundShipments/:SelectedWarehouseId',canActivate: [AuthGuard], component:InboundShipmentsComponent, data: {title: 'Inbound Shipments'}},
  {path:'InboundShipments/:SelectedWarehouseId/:InboundShipmentId',canActivate: [AuthGuard], component:PlaceInboundShipmentComponent, data: {title: 'View Inbound Shipment'}},
  {path:'InboundShipments/:SelectedWarehouseId/:InboundShipmentId/:Module',canActivate: [AuthGuard], component:PlaceInboundShipmentComponent, data: {title: 'View Inbound Shipment'}},
  {path:'Integrations',canActivate: [AuthGuard], component:IntegrationsComponent, data: {title: 'Integrations'}},
  {path:'Inventory/:SelectedWarehouseId',canActivate: [AuthGuard], component:InventoryComponent, data: {title: 'Inventory'}},
  {path:'Inventory/:SelectedWarehouseId/:ItemId',canActivate: [AuthGuard], component:InventoryComponent, data: {title: 'Inventory'}},
  {path:'MasterInventory/:SelectedWarehouseId',canActivate: [AuthGuard], component:MasterInventoryComponent, data: {title: 'Master Inventory'}},
  {path:'MasterInventory/:SelectedWarehouseId/:ItemId',canActivate: [AuthGuard], component:MasterInventoryComponent, data: {title: 'Master Inventory'}},
  {path:'MasterInventory/:SelectedWarehouseId/:ItemId/Serials',canActivate: [AuthGuard], component:MasterSerialsComponent, data: {title: 'Master Serials'}},
  {path:'UnitsOfMeasures/:SelectedWarehouseId', canActivate: [AuthGuard], component:UnitsOfMeasuresComponent, data:{title: 'Units of Measures'}},
  {path:'UnitsOfMeasures/:SelectedWarehouseId/:ItemId', canActivate: [AuthGuard], component:UnitsOfMeasuresComponent, data:{title: 'Units of Measures'}},
  {path:'Orders/:SelectedWarehouseId',canActivate: [AuthGuard], component:OrdersComponent, data: {title: 'Orders'}},
  {path:'Orders/:SelectedWarehouseId/:OrderId',canActivate: [AuthGuard], component:PlaceOrderComponent, data: {title: 'View Order'}},
  {path:'Orders/:SelectedWarehouseId/:OrderId/:Module',canActivate: [AuthGuard], component:PlaceOrderComponent, data: {title: 'View Order'}},
  {path:'Reports/:SelectedWarehouseId',canActivate: [AuthGuard], component:ReportsComponent, data: {title: 'Reports'}},
  {path:'Transactions/:SelectedWarehouseId',canActivate: [AuthGuard], component:TransactionsComponent, data: {title: 'Transactions'}},
  {path:'UserProfile',canActivate: [AuthGuard], component:UserProfileComponent, data: {title: 'User Profile'}},
  {path:'Warehouses', canActivate: [AuthGuard], component:WarehousesComponent, data: {title: 'Warehouses'}},
  {path:'PlaceOrder/:SelectedWarehouseId', canActivate: [AuthGuard], component:PlaceOrderComponent, data: {title: 'Place Order'}},
  {path:'PlaceInboundShipment/:SelectedWarehouseId',canActivate: [AuthGuard], component:PlaceInboundShipmentComponent, data: {title: 'Place Inbound Shipment'}},
  {path:'MasterInventory/UnitsOfMeasures',canActivate: [AuthGuard], component:UnitsOfMeasuresComponent, data: {title: 'Units of Measures'}},
  {path:'Integrations/Webhooks',canActivate: [AuthGuard], component:WebhooksComponent, data: {title: 'Webhooks'}},
  {path:'Integrations/CsvImports',canActivate: [AuthGuard], component:CsvImportsComponent, data: {title: 'CSV Imports'}},
  {path:'Integrations/CsvExports',canActivate: [AuthGuard], component:CsvExportsComponent, data: {title: 'CSV Exports'}},
  {path:'Accounts/Customers', canActivate: [AuthGuard], component:CustomersComponent, data:{title: 'Customers'}},
  {path:'Accounts/Vendors', canActivate: [AuthGuard], component:VendorsComponent, data:{title: 'Vendors'}},
  {path:'Accounts/Customers/:id', canActivate: [AuthGuard], component:CustomersComponent, data:{title: 'Customers'}},
  {path:'Accounts/Vendors/:id', canActivate: [AuthGuard], component:VendorsComponent, data:{title: 'Vendors'}},
  {path:'Allocations/:SelectedWarehouseId', canActivate: [AuthGuard], component:AllocationsComponent, data:{title: 'Allocations'}},
  {path:'Allocations/:SelectedWarehouseId/:OrderId', canActivate: [AuthGuard], component:AllocationsComponent, data:{title: 'Allocations'}},
  {path:'Locations/:SelectedWarehouseId', canActivate: [AuthGuard], component:LocationsComponent, data:{title: 'Locations'}},
  {path:'Locations/:SelectedWarehouseId/:Location', canActivate: [AuthGuard], component:LocationsComponent, data:{title: 'Locations'}},
  {path:'Invoices/:SelectedWarehouseId', canActivate:[AuthGuard], component:InvoicesComponent, data:{title: 'Invoices'}},
  {path:'Invoices/:SelectedWarehouseId/:InvoiceId', canActivate:[AuthGuard], component:InvoicesComponent, data:{title: 'Invoices'}},
  {path:'Kits/:SelectedWarehouseId',canActivate: [AuthGuard], component:KitsComponent, data: {title: 'Kits'}},
  {path:'Kits/:SelectedWarehouseId/:KitId',canActivate: [AuthGuard], component:KitsComponent, data: {title: 'Kits'}},
  {path:'GShip/:SelectedWarehouseId',canActivate: [AuthGuard], component:GShipComponent, data: {title: 'GShip'}},
  {path:'GShip/:SelectedWarehouseId/:GShipId',canActivate: [AuthGuard], component:ViewGshipComponent, data: {title: 'View '}},
  {path:'GShipPickups', canActivate: [AuthGuard], component:PickupsComponent, data: {title:'GShip Pickups'}},
  {path:'GShipPickups/:SelectedWarehouseId', canActivate: [AuthGuard], component:PickupsComponent, data: {title:'GShip Pickups'}},
  {path:'GShipPickups/:SelectedWarehouseId/:PickupId', canActivate: [AuthGuard], component:PickupsComponent, data: {title:'GShip Pickup'}},
  // otherwise redirect to home
  { path: '**', redirectTo: '/Login',  data:{title: 'Login'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

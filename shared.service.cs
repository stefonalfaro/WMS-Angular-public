import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import { WebDriver } from 'protractor';
import { WindowDock } from 'ng-bootstrap-icons/icons';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  readonly APIUrl = environment.APIUrl;
  readonly TLSUrl = environment.TLSAPIUrl;
  readonly TwoShipAPIUrl = environment.TwoShipAPIURL;

  constructor(private http:HttpClient) { }

  TwoShipGetCarriers(Request){
    return this.http.post(this.TwoShipAPIUrl+'/GetCarriers_V1', Request);
  }

  TwoShipCreatePickup(Request){
    return this.http.post(this.TwoShipAPIUrl+'/CreatePickupRequest_V1', Request);
  }

  TwoShipCancelPickup(Request){
    return this.http.post(this.TwoShipAPIUrl+'/CancelPickupRequest_V1', Request);
  }

  TwoShipRateSummary(Request){
    return this.http.post(this.TwoShipAPIUrl+'/Rate_Summary_V1', Request)
  }

  TwoShipHold(Request){
    return this.http.post(this.TwoShipAPIUrl+'/Hold_V1', Request);
  }

  TwoShipShip(Request){
    return this.http.post(this.TwoShipAPIUrl+'/Ship_V1', Request);
  }

  TwoShipDeleteShipment(Request){
    return this.http.post(this.TwoShipAPIUrl+'/DeleteShipment_V1', Request);
  }

  TwoShipGetTrackingUpdates(Request){
    return this.http.post(this.TwoShipAPIUrl+'/Tracking_V1', Request);
  }

  TwoShipGetStatusUpdates(Request){
    return this.http.post(this.TwoShipAPIUrl+'/GetOrdersStatus', Request);
  }

  GetNotifications(){
    return this.http.get(this.APIUrl+'/Notifications')
  }

  GetMaintenanceMode(){
    return this.http.get(this.APIUrl+'/Config/MaintenanceModeClient')
  }

  CreateNotification(NotificationObject, WarehouseId:any){
    return this.http.post(this.APIUrl+'/Notifications/'+WarehouseId, NotificationObject);
  }

  UpdateNotification(NotificationObject){
    return this.http.put(this.APIUrl+'/Notifications', NotificationObject);
  }

  DeleteNotification(id:any){
    return this.http.delete(this.APIUrl+'/Notifications/'+id);
  }

  GetPickupsByWarehouseId(wid:any){
    return this.http.get(this.APIUrl+'/GShipPickups/'+wid)
  }

  GetPickupById(id:any){
    return this.http.get(this.APIUrl+'/GShipPickups/0/'+id)
  }

  Get2ShipAPIKey(APIMode:string){
    return this.http.get(this.APIUrl+'/AccountNumbers/0/'+APIMode+'/2Ship') //2ShipTest or 2ShipProd as METHOD value
  }

  CreatePickup(PickupObject, wid:any){
    return this.http.post(this.APIUrl+'/GShipPickups/'+wid, PickupObject)
  }

  DeletePickup(id:number){
    return this.http.delete(this.APIUrl+'/GShipPickups/'+id)
  }

  GetGShipsByWarehouseId(wid:any){
    return this.http.get(this.APIUrl+'/GShips/'+wid);
  }

  GetGShipsById(GShipId:any){
    return this.http.get(this.APIUrl+'/GShips/0/'+GShipId);
  }

  CreateGShip(wid:any, GShip:any){
    return this.http.post(this.APIUrl+'/GShips/'+wid, GShip);
  }

  DeleteGShipAndPackages(GShipId:number){
    return this.http.delete(this.APIUrl+'/GShipPackages/0/'+GShipId);
  }

  GetGShipPackagesByGShipId(GShipId:any){
    return this.http.get(this.APIUrl+'/GShipPackages/'+GShipId);
  }

  CreateGShipPackage(Package:any){
    return this.http.post(this.APIUrl+'/GShipPackages', Package);
  }

  getDistinctLocationsList(wid:string){
    return this.http.get<any>(this.APIUrl+'/Locations/'+wid+'/distinct');
  }

  getInventoryLocationsList(wid:string){
    return this.http.get<any>(this.APIUrl+'/Locations/'+wid+'/Inventory');
  }

  getReceivingLocationsList(wid:string){
    return this.http.get<any>(this.APIUrl+'/Locations/'+wid+'/Receiving');
  }

  getStagingLocationsList(wid:string){
    return this.http.get<any>(this.APIUrl+'/Locations/'+wid+'/Staging');
  }

  getItemsByLocationList(wid:string, location:string){
    return this.http.get<any>(this.APIUrl+'/Locations/'+wid+'/filter/'+location);
  }

  getLocationConfigList(wid:string, location:string){
    return this.http.get<any>(this.APIUrl+'/Locations/'+wid+'/config/'+location);
  }

  addLocationConfig(wid:string, val:any){
    return this.http.post(this.APIUrl+'/Locations/'+wid, val);
  }

  updateLocationConfig(val:any){
    return this.http.put(this.APIUrl+'/Locations', val);
  }

  getReportsList():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/Reports');
  }

  getReportsListByType(type):Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/Reports/'+type);
  }

  getPrintersList(){
    return this.http.get<any>(this.APIUrl+'/Printers');
  }

  addPrinter(val:any){
    return this.http.post(this.APIUrl+'/Printers', val)
  }

  updatePrinter(val:any){
    return this.http.put(this.APIUrl+'/Printers', val)
  }

  deletePrinter(id:number){
    return this.http.delete(this.APIUrl+'/Printers/'+id)
  }

  getConfigsList():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/Config');
  }

  getLabelsList():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/Labels');
  }

  getClientsList():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/Clients');
  }

  getClient(val:any){
    return this.http.get<any>(this.APIUrl+'/Clients/'+val);
  }

  getMasterSerialsbyItemId(ItemId:number){
    return this.http.get<any>(this.APIUrl+'/MasterSerials/'+ItemId);
  }

  deleteMasterSerial(id:number){
    return this.http.delete<any>(this.APIUrl+'/MasterSerials/'+id);
  }

  addMasterSerial(val:any){
    return this.http.post(this.APIUrl+'/MasterSerials/', val);
  }

  updateMasterSerial(val:any){
    return this.http.put(this.APIUrl+'/MasterSerials/', val);
  }

  getInventory(val:any){
    return this.http.get<any>(this.APIUrl+'/Inventory/'+val);
  }

  getOrderDocuments(OrderId:any){
    return this.http.get(this.APIUrl+'/OrderDocuments/'+OrderId)
  }

  readDocument(id:any){
    return this.http.get(this.APIUrl+'/OrderDocuments/ReadFile/'+id)
  }

  deleteOrderDocument(id:any){
    return this.http.delete(this.APIUrl+'/OrderDocuments/'+id)
  }

  getInventoryBySKU(val:any, ItemId:number){
    return this.http.get<any>(this.APIUrl+'/Inventory/'+val+'/'+0+'/'+ItemId);
  }

  getAvailableInventoryBySKU(val:any, ItemId:number){
    return this.http.get<any>(this.APIUrl+'/Inventory/'+val+'/'+0+'/'+ItemId+'/Available');
  }

  searchInventorySKUbyString(wid:any, SKU:string){
    return this.http.get<any>(this.APIUrl+'/Inventory/'+wid+'/'+0+'/'+SKU+'/SearchString');
  }

  getAllWarehouses():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/Warehouses');
  }

  getWarehouses(val:any){
    return this.http.get<any>(this.APIUrl+'/Warehouses/'+val);
  }

  getAllocations(wid:any){
    return this.http.get<any>(this.APIUrl+'/Allocations/'+wid);
  }

  getOrderPackages(OrderId:any){
    return this.http.get<any>(this.APIUrl+'/OrderPackages/'+OrderId);
  }

  getAccountNumbers(){
    return this.http.get<any>(this.APIUrl+'/AccountNumbers')
  }

  getAccountNumbersByWarehouseId(WarehouseId:any){
    return this.http.get<any>(this.APIUrl+'/AccountNumbers/'+WarehouseId)
  }

  updateAccountNumber(AccountNumber:any){
    return this.http.put(this.APIUrl+'/AccountNumbers', AccountNumber);
  }

  updateOrderPackageTracking(val:any){
    return this.http.put(this.APIUrl+'/OrderPackageItems/TrackingNumber', val);
  }

  setOrderOpen(val:any){
    return this.http.put(this.APIUrl+'/Orders/SetOPEN', val);
  }

  setOrderShipped(val:any){
    return this.http.put(this.APIUrl+'/Orders/SetSHIPPED', val);
  }

  updateOrderWeight(val:any){
    return this.http.put(this.APIUrl+'/Orders/UpdateWeight', val);
  }

  addAccountNumber(val:any, wid:number){
    return this.http.post(this.APIUrl+'/Orders/'+wid, val)
  }

  

  updateOrderPackage(val:any){
    return this.http.put(this.APIUrl+'/OrderPackages', val);
  }

  getOrderPackageItems(PackageId:any){
    return this.http.get<any>(this.APIUrl+'/OrderPackageItems/'+PackageId);
  }

  getOrderPackageItemsFromOrder(OrderId:any){
    return this.http.get<any>(this.APIUrl+'/OrderPackageItems/0/'+OrderId);
  }

  getAllocationsByOrderId(wid:any, OrderId:any){
    return this.http.get<any>(this.APIUrl+'/Allocations/'+wid+'/'+0+'/'+OrderId);
  }

  addWarehouse(val:any){
    return this.http.post(this.APIUrl+'/Warehouses', val);
  }

  addWarehouseAdmin(val:any, ClientId:any){
    return this.http.post(this.APIUrl+'/Warehouses/'+ ClientId, val);
  }

  addItem(val:any, wid:any){
    return this.http.post(this.APIUrl+'/Inventory/'+wid, val);
  }

  generateGS1Labels(val:any){
    return this.http.post(this.APIUrl+'/GS1Labels', val)
  }

  receiveItem(val:any, wid:any){
    return this.http.post(this.APIUrl+'/ReceiveItem/'+wid, val);
  }

  allocateItem(val:any, wid:any){
    return this.http.post(this.APIUrl+'/Allocations/'+wid, val);
  }

  allocateItemManually(val:any, wid:any, InventoryId:any){
    return this.http.post(this.APIUrl+'/Allocations/'+wid+'/'+InventoryId, val);
  }

  createAccountNumber(AccountNumber:any){
    return this.http.post(this.APIUrl+'/AccountNumbers', AccountNumber);
  }

  deleteAccountNumber(id:any){
    return this.http.delete<any>(this.APIUrl+'/AccountNumbers/'+id);
  }

  updateAllocation(val:any){
    return this.http.put(this.APIUrl+'/Allocations', val);
  }

  updateItem(val:any){
    return this.http.put(this.APIUrl+'/Inventory', val);
  }

  deleteItem(val:any){
    return this.http.delete<any>(this.APIUrl+'/Inventory/'+val);
  }

  UnAllocateOrderItem(OrderItemId:number){
    return this.http.delete<any>(this.APIUrl+'/Allocations/0/'+OrderItemId)
  }

  deleteOrderPackage(id:any){
    return this.http.delete<any>(this.APIUrl+'/OrderPackages/'+id)
  }

  deleteOrderPackageItem(val:any){
    return this.http.put(this.APIUrl+'/OrderPackageItems', val)
  }

  deleteConfig(id:number){
    return this.http.delete<any>(this.APIUrl+'/Config/'+id);
  }

  addConfig(val:any){
    return this.http.post(this.APIUrl+'/Config', val);
  }

  updateConfig(val:any){
    return this.http.put(this.APIUrl+'/Config', val);
  }

  addOrder(val:any, wid:any){
    return this.http.post(this.APIUrl+'/Orders/'+wid, val)
  }

  addOrderPackage(val:any, OrderId:any){
    return this.http.post(this.APIUrl+'/OrderPackages/'+OrderId, val);
  }

  addOrderPackageItems(val:any, PackageId:any){
    return this.http.post(this.APIUrl+'/OrderPackageItems/'+PackageId, val);
  }

  updateOrder(val:any){
    return this.http.put(this.APIUrl+'/Orders', val)
  }

  getStatuses(){
    return this.http.get(this.APIUrl+'/Statuses');
  }

  getStatusesByType(Type:any){
    return this.http.get(this.APIUrl+'/Statuses/'+Type);
  }

  deleteStatus(id:any){
    return this.http.delete(this.APIUrl+'/Statuses/'+id)
  }

  addStatus(val:any){
    return this.http.post(this.APIUrl+'/Statuses', val);
  }

  updateStatus(val:any){
    return this.http.put(this.APIUrl+'/Statuses', val)
  }

  deleteOrder(val:any){
    return this.http.delete(this.APIUrl+'/Orders/'+val);
  }
  
  addReport(val:any){
    return this.http.post(this.APIUrl+'/Reports', val);
  }

  updateReport(val:any){
    return this.http.put(this.APIUrl+'/Reports', val);
  }

  deleteReport(val:any){
    return this.http.delete(this.APIUrl+'/Reports/'+val);
  }

  deleteLocation(id:number){
    return this.http.delete(this.APIUrl+'/Locations/'+id);
  }

  addLabel(val:any){
    return this.http.post(this.APIUrl+'/Labels', val);
  }

  pickItem(val:any, wid:string){
    return this.http.post(this.APIUrl+'/PickItem/'+wid, val);
  }

  updateLabel(val:any){
    return this.http.put(this.APIUrl+'/Labels', val);
  }

  deleteLabel(val:any){
    return this.http.delete(this.APIUrl+'/Labels/'+val);
  }

  getOrderItems(orderID:any){
    return this.http.get(this.APIUrl+'/OrderItems/'+orderID);
  }


  getOrderItemsByUOM(orderID:any, UOM:any){
    return this.http.get(this.APIUrl+'/OrderItems/'+orderID+'/'+0+'/'+UOM);
  }

  getOrderItemsUnpacked(orderID:any){
    return this.http.get(this.APIUrl+'/OrderItems/'+orderID+'/0/0/unpacked');
  }

  getOrderItem(val:any, orderID:any, id:any){
    return this.http.get(this.APIUrl+'/OrderItems/'+orderID+'/'+id, val);
  }

  pickOrderItem(val:any, orderID:any, id:any){
    return this.http.put(this.APIUrl+'/OrderItems/Picked/'+id+'/'+orderID+'', val);
  }

  updateOrderItemQuantity(val:any, OrderItemId:number, NewQuantity:number){
    return this.http.put(this.APIUrl+'/OrderItems/Quantity/'+OrderItemId+'/'+NewQuantity, val)
  }

  updateInboundShipmentItemQuantity(val:any, OrderItemId:number, NewQuantity:number){
    return this.http.put(this.APIUrl+'/InboundShipmentItems/Quantity/'+OrderItemId+'/'+NewQuantity, val)
  }

  updateInboundShipmentItemStatus(val:any, OrderItemId:number, Status:string){
    return this.http.put(this.APIUrl+'/InboundShipmentItems/Status/'+OrderItemId+'/'+Status, val)
  }

  addOrderItem(val:any, orderID:any){
    return this.http.post(this.APIUrl+'/OrderItems/'+orderID, val);
  }

  packOrderItem(val:any){
    return this.http.post(this.APIUrl+'/OrderPackageItems', val)
  }

  unpackOrderItem(val:any){
    return this.http.delete(this.APIUrl+'/OrderPackageItems', val)
  }

  convertItem(val:any, wid:any){
    return this.http.put(this.APIUrl+'/Inventory/Convert', val);
  }
  
  updateOrderItem(val:any, orderID:any, id:any){
    return this.http.post(this.APIUrl+'/OrderItems/'+orderID+'/'+id, val);
  }

  editOrderItem(val:any){
    return this.http.put(this.APIUrl+'/OrderItems', val);
  }

  editInboundShipmentItem(val:any){
    return this.http.patch(this.APIUrl+'/InboundShipmentItems', val);
  }

  deleteOrderItem(orderID:any, id:any){
    return this.http.delete(this.APIUrl+'/OrderItems/'+orderID+'/'+id);
  }

  deleteAllocation(id:any){
    return this.http.delete(this.APIUrl+'/Allocations/'+id);
  }

  deleteAllocationByOrderItemId(ItemId:any){
    return this.http.delete(this.APIUrl+'/Allocations/0/'+ItemId);
  }

  addInboundShipment(val:any, wid:any){
    return this.http.post(this.APIUrl + '/InboundShipments/' + wid, val)
  }

  shipOrder(val:any){
    return this.http.put(this.APIUrl+'/Orders/Ship', val);
  }

  sendTomyBatch(val:any){
    return this.http.put(this.APIUrl+'/Orders/GenerateTomyBatch', val);
  }

  updateInboundShipment(val:any){
    return this.http.put(this.APIUrl + '/InboundShipments/', val)
  }

  deleteInboundShipment(val:any){
    return this.http.delete(this.APIUrl + '/InboundShipments/' + val)
  }

  getInboundShipmentItems(orderID:any){
    return this.http.get(this.APIUrl+'/InboundShipmentItems/'+orderID);
  }

  getInboundShipmentItem(orderID:any, id:any){
    return this.http.get(this.APIUrl+'/InboundShipmentItems/'+orderID+'/'+id);
  }

  addInboundShipmentItem(val:any, orderID:any){
    return this.http.post(this.APIUrl+'/InboundShipmentItems/'+orderID, val);
  }

  updateInboundShipmentItem(val:any, orderID:any, id:any){
    return this.http.post(this.APIUrl+'/InboundShipmentItems/'+orderID+'/'+id, val);
  }

  deleteInboundShipmentItem(orderID:any, id:any){
    return this.http.delete(this.APIUrl+'/InboundShipmentItems/'+orderID+'/'+id);
  }


  updateWarehouse(val:any){
    return this.http.put<any>(this.APIUrl+'/Warehouses', val);
  }

  deleteWarehouse(val:any){
    return this.http.delete<any>(this.APIUrl+'/Warehouses/'+val);
  }

  getUnitsofMeasures(val:any){
    return this.http.get<any>(this.APIUrl+'/UnitsofMeasure/'+val);
  }

  getUOMChildQuantity(wid:any, ItemId:any, UOMId:any){
    return this.http.get<any>(this.APIUrl+'/UnitsofMeasure/'+wid+'/'+ItemId+'/'+UOMId+'/ChildQuantity');
  }

  getUOMParentQuantity(wid:any, ItemId:any, UOMId:any){
    return this.http.get<any>(this.APIUrl+'/UnitsofMeasure/'+wid+'/'+ItemId+'/'+UOMId+'/ParentQuantity');
  }

  getUnitsofMeasuresBySKU(wid:any, val:any){
    return this.http.get<any>(this.APIUrl+'/UnitsofMeasure/'+wid+'/'+val);
  }

  addUnitsofMeasures(wid:any, val:any){
    return this.http.post(this.APIUrl+'/UnitsofMeasure/'+wid, val)
  }

  generatePalletLabels(wid:any, val:any){
    return this.http.post(this.APIUrl+'/Labels/'+wid+'/PalletLabels', val)
  }

  updateUnitsofMeasures(val:any){
    return this.http.put<any>(this.APIUrl+'/UnitsofMeasure/', val)
  }

  transferOrderToWarehouse(OrderObject:any, NewWarehouseId:number){
    return this.http.put<any>(this.APIUrl+'/Orders/Transfer/'+NewWarehouseId, OrderObject);
  }

  AutoPackOrder(OrderObject:any, OrderId:number){
    return this.http.put<any>(this.APIUrl+'/Orders/AutoPack/'+OrderId, OrderObject);
  }

  deleteUnitsofMeasures(val:any){
    return  this.http.delete<any>(this.APIUrl+'/UnitsofMeasure/'+val);
  }

  getOrder(val:any, id:any){
    return this.http.get<any>(this.APIUrl+'/Orders/'+val+'/'+id);
  }

  searchOrder(wid:any, value:string){
    return this.http.get<any>(this.APIUrl+'/Orders/'+wid+'/0/'+value+'/SearchString');
  }

  searchOrderNotShipped(wid:any){
    return this.http.get<any>(this.APIUrl+'/Orders/'+wid+'/0/0/NotShipped');
  }

  searchTransactions(wid:any, value:string){
    return this.http.get<any>(this.APIUrl+'/Transactions/'+wid+'/0/'+value+'/SearchString');
  }

  searchGShips(wid:any, value:string){
    return this.http.get<any>(this.APIUrl+'/GShips/'+wid+'/'+value+'/SearchString');
  }

  searchPickups(wid:any, value:string){
    return this.http.get<any>(this.APIUrl+'/GShipPickups/'+wid+'/'+value+'/SearchString')
  }

  searchTransactionsOrders(wid:any, id:number){
    return this.http.get<any>(this.APIUrl+'/Transactions/'+wid+'/0/'+id+'/Orders');
  }

  searchTransactionsInboundShipment(wid:any, id:number){
    return this.http.get<any>(this.APIUrl+'/Transactions/'+wid+'/0/'+id+'/InboundShipments');
  }

  getOrdersForNextBatch(wid:any, CustomerId:number){
    return this.http.get<any>(this.APIUrl+'/Orders/'+ wid + '/0/'+CustomerId+'/ForNextBatch')
  }

  getOrders(val:any){
    return this.http.get<any>(this.APIUrl+'/Orders/'+val);
  }

  getOrdersBasic(val:any){
    return this.http.get<any>(this.APIUrl+'/OrdersBasic/'+val);
  }

  searchOrdersByDateLess(wid:any, ToDate:number){
    return this.http.get(this.APIUrl + '/Orders/'+wid+'/0/LESS/0/'+ToDate);
  }

  searchOrdersByDateGreater(wid:any, FromDate:number){
    return this.http.get(this.APIUrl + '/Orders/'+wid+'/0/GREATER/'+FromDate+'/0');
  }

  searchOrdersByDateBetween(wid:any, FromDate:number, ToDate:number){
    return this.http.get(this.APIUrl + '/Orders/'+wid+'/0/BETWEEN/'+FromDate+'/'+ToDate);
  }

  
  searchOrdersByDateLessRequested(wid:any, ToDate:number){
    return this.http.get(this.APIUrl + '/Orders/'+wid+'/0/LESSREQ/0/'+ToDate);
  }

  searchOrdersByDateGreaterRequested(wid:any, FromDate:number){
    return this.http.get(this.APIUrl + '/Orders/'+wid+'/0/GREATERREQ/'+FromDate+'/0');
  }

  searchOrdersByDateBetweenRequested(wid:any, FromDate:number, ToDate:number){
    return this.http.get(this.APIUrl + '/Orders/'+wid+'/0/BETWEENREQ/'+FromDate+'/'+ToDate);
  }

  getOrdersByStatus(WarehouseId:string, Status:string){
    return this.http.get<any>(this.APIUrl+'/Orders/'+WarehouseId+'/0/'+Status)
  }

  getInboundShipment(val:any, id:any){
    return this.http.get<any>(this.APIUrl+'/InboundShipments/'+val+'/'+id)
  }
  
  searchInboundShipments(wid:any, value:string){
    return this.http.get<any>(this.APIUrl+'/InboundShipments/'+wid+'/0/'+value+'/SearchString')
  }

  searchUnitsOfMeasures(wid:any, value:string){
    return this.http.get<any>(this.APIUrl+'/UnitsofMeasure/'+wid+'/0/'+value+'/SearchString/0')
  }

  getInboundShipments(val:any){
    return this.http.get<any>(this.APIUrl+'/InboundShipments/'+val)
  }

  getInboundShipmentsByStatus(WarehouseId:string, Status:string){
    return this.http.get<any>(this.APIUrl+'/InboundShipments/'+WarehouseId+'/0/'+Status)
  }


  getMasterInventory(val:any){
    return this.http.get<any>(this.APIUrl+'/MasterInventory/'+val);
  }

  getUser(id:number){
    return this.http.get(this.APIUrl+'/Users/'+id);
  }

  getMasterItem(val:any, id:number){
    return this.http.get<any>(this.APIUrl+'/MasterInventory/'+val+'/'+id);
  }

  searchMasterInventory(wid:any, value:string){
    return this.http.get(this.APIUrl+'/MasterInventory/'+wid+'/'+value+'/SearchString')
  }

  getMasterInventoryBasic(wid:any){
    return this.http.get(this.APIUrl+'/MasterInventory/'+wid+'/0/BasicDataset')
  }

  getTransactions(val:any){
    return this.http.get<any>(this.APIUrl+'/Transactions/'+val);
  }

  getAutoBillableServices(){
    return this.http.get(this.APIUrl+'/AutoBilling');
  }

  addClient(val:any){
    return this.http.post(this.APIUrl + '/Clients', val);
  }

  getKits(wid:any){
    return this.http.get(this.APIUrl+'/Kits/'+wid);
  }

  getKitsById(wid:any, id:number){
    return this.http.get(this.APIUrl+'/Kits/'+wid+'/'+id);
  }

  getKitSKUs(KitId:number){
    return this.http.get(this.APIUrl+'/KitSKUs/'+KitId);
  }

  getKitSKUsById(id:number){
    return this.http.get(this.APIUrl+'/KitSKUs/'+id);
  }

  addKit(KitObject:any, wid:any){
    return this.http.post(this.APIUrl+'/Kits/'+wid, KitObject);
  }

  addKitSKU(KitSKU:any, KitId:number){
    return this.http.post(this.APIUrl+'/KitSKUs/'+KitId, KitSKU);
  }

  addMasterItem(wid:any, val:any){
    return this.http.post(this.APIUrl+'/MasterInventory/'+wid, val)
  }

  receiveInboundItem(val:any){
    return this.http.put(this.APIUrl+'/InboundShipmentItems', val);
  }

  userChangePassword(val:any){
    return this.http.put(this.APIUrl+'/Users/ChangePassword', val);
  }

  updateKitSKU(KitSKU:any){
    return this.http.put(this.APIUrl+'/KitSKUs', KitSKU);
  }

  receiveInboundShipment(val:any){
    return this.http.post(this.APIUrl+'/ReceiveInboundShipment', val);
  }

  updateMasterItem(val:any){
    return this.http.put(this.APIUrl+'/MasterInventory', val);
  }

  updateKit(val:any){
    return this.http.put(this.APIUrl+'/Kits', val);
  }

  stockTransfer(wid:any, InventoryObject:any, NewLocation:string){
    return this.http.put(this.APIUrl+'/Locations/'+wid+'/'+NewLocation, InventoryObject);
  }

  deleteMasterItem(val:any){
    return this.http.delete(this.APIUrl+'/MasterInventory/'+val);
  }

  deleteByPO(wid:string, PO:string){
    return this.http.delete(this.APIUrl+'/Inventory/'+wid+'/'+PO);
  }

  deleteKit(id:number){
    return this.http.delete(this.APIUrl+'/Kits/'+id)
  }

  deleteKitSKU(id:number){
    return this.http.delete(this.APIUrl+'/KitSKUs/0/'+id)
  }

  updateClient(val:any){
    return this.http.put(this.APIUrl+'/Clients', val);
  }

  addUser(val:any){
    return this.http.post(this.APIUrl+'/Users', val);
  }

  updateUser(val:any){
    return this.http.put(this.APIUrl+'/Users', val)
  }

  deleteUser(val:any){
    return this.http.delete(this.APIUrl+'/Users/'+val);
  }

  UploadOrderCSV(val:any){
    return this.http.post(this.APIUrl+'/Orders/SaveCSV', val);
  }

  UploadInboundShipmentCSV(val:any){
    return this.http.post(this.APIUrl+'/InboundShipments/SaveCSV', val);
  }

  UploadInventoryItemCSV(val:any){
    return this.http.post(this.APIUrl+'/Inventory/SaveCSV', val);
  }

  UploadMasterInventoryCSV(val:any){
    return this.http.post(this.APIUrl+'/MasterInventory/SaveCSV', val);
  }

  UploadClientsCSV(val:any){
    return this.http.post(this.APIUrl+'/Clients/SaveCSV', val);
  }

  UploadWarehousesCSV(val:any){
    return this.http.post(this.APIUrl+'/Warehouses/SaveCSV', val);
  }

  UploadUserCSV(val:any){
    return this.http.post(this.APIUrl+'/Users/SaveCSV', val);
  }

  GetUsersList():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/Users');
  }

  deleteClient(val:any){
    return this.http.delete(this.APIUrl+'/Clients/'+val);
  }

  
  getAccounts(type:any){
    return this.http.get(this.APIUrl + '/Accounts/' + type);
  }

  searchAccounts(type:string, value:string){
    return this.http.get(this.APIUrl+'/Accounts/'+type+'/'+value+'/SearchString')
  }

  searchAllocations(wid:string, value:string){
    return this.http.get(this.APIUrl+'/Allocations/'+wid+'/0/'+value+'/SearchString')
  }

  searchKitsByString(wid:any, value:string){
    return this.http.get(this.APIUrl+'/Kits/'+wid+'/0/'+value+'/SearchString')
  }

  getAccount(type:any, id:number){
    return this.http.get(this.APIUrl + '/Accounts/' + type+'/'+id);
  }

  addAccount(val:any){
    return this.http.post(this.APIUrl + '/Accounts', val);
  }

  updateAccount(val:any){
    return this.http.put(this.APIUrl + '/Accounts', val);
  }

  addIntegration(val:any){
    return this.http.post(this.APIUrl+'/Integrations', val);
  }

  updateIntegration(val:any){
    return this.http.put(this.APIUrl+'/Integrations', val);
  }

  deleteAccount(val:any){
    return this.http.delete(this.APIUrl + '/Accounts/' + val);
  }

  deleteIntegration(id:any){
    return this.http.delete(this.APIUrl+'/Integrations/'+ id);
  }

  ExportToTLSCount(val:any){
    return this.http.put(this.APIUrl + '/ExportToTLS/', val)
  }

  FlagForTomyBatch(OrderId:any){
    return this.http.get(this.APIUrl + '/Export/FlagForTomyBatch/' + OrderId)
  }

  UnpackOrder(OrderId:any){
    return this.http.delete(this.APIUrl + '/OrderPackages/UnpackAll/' + OrderId);
  }

  Generate945XML(OrderId:any, CustomerId:any){
    return this.http.get(this.APIUrl+'/Export/945/' + OrderId + "/" + CustomerId)
  }

  Generate856XML(OrderId:any, CustomerId:any){
    return this.http.get(this.APIUrl+'/Export/856/' + OrderId + "/" + CustomerId)
  }

  Generate856ShipToXML(OrderId:any, CustomerId:any, ShipToId:any){
    return this.http.get(this.APIUrl+'/Export/856/' + OrderId + "/" + CustomerId + "/" + ShipToId)
  }

  GenerateFlatFileASN(OrderId:any, CustomerId:any){
    return this.http.get(this.APIUrl+'/Export/FlatFileASN/' + OrderId + "/" + CustomerId)
  }

  deleteService(id:any){
    return this.http.delete(this.APIUrl+'/Services/'+id);
  }

  updateService(val:any){
    return this.http.put(this.APIUrl+'/Services', val);
  }

  addService(val:any){
    return this.http.post(this.APIUrl+'/Services', val);
  }

  getServicesList(){
    return this.http.get(this.APIUrl+'/Services');
  }

  getIntegrationsList(){
    return this.http.get(this.APIUrl+'/Integrations');
  }

  getSummaryBilling(OrderId:string){
    return this.http.get(this.APIUrl+'/OrderBilling/SummaryBilling/'+OrderId);
  }

  getOrderBilling(OrderId:string){
    return this.http.get(this.APIUrl+'/OrderBilling/'+OrderId);
  }

  addOrderBilling(val:any){
    return this.http.post(this.APIUrl+'/OrderBilling', val);
  }

  updateOrderBilling(val:any){
    return this.http.put(this.APIUrl+'/OrderBilling', val);
  }

  deleteOrderBilling(id:any){
    return this.http.delete(this.APIUrl+'/OrderBilling/'+id);
  }

  TLSCreateWaybillHeader(val:any){
    return this.http.post(this.APIUrl + '/ExportToTLS/Header', val); //this.TLSUrl + '/WaybillHeader'
  }
  TLSCreateWaybillBillTo(val:any){
    return this.http.post(this.APIUrl + '/ExportToTLS/BillToAddress', val); //this.TLSUrl + '/WaybillBillToAddress'
  }
  TLSCreateWaybillPickup(val:any){
    return this.http.post(this.APIUrl + '/ExportToTLS/PickupAddress', val);
  }
  TLSCreateWaybillShipTo(val:any){
    return this.http.post(this.APIUrl + '/ExportToTLS/ShipToAddress', val);
  }
  TLSCreateWaybillRevenue(val:any){
    return this.http.post(this.APIUrl + '/ExportToTLS/Revenue', val);
  }
  TLSCreateWaybillCost(val:any){
    return this.http.post(this.APIUrl + '/ExportToTLS/Cost', val);
  }
  TLSCreateWaybillDimensionLines(val:any){
    return this.http.post(this.APIUrl + '/ExportToTLS/DimensionLines', val);
  }
  TLSCreateWaybillAccessory(val:any){
    return this.http.post(this.APIUrl + '/ExportToTLS/Accessory', val);
  }

  GetSystemConfig(val:any){
    return this.http.get(this.APIUrl+ '/Config/' + val);
  }
}

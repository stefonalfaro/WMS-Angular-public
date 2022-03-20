import { Component, OnInit, Input } from '@angular/core';
import {SharedService} from 'src/app/shared.service';
import { DecimalPipe, Time } from '@angular/common';
//import { DatePipe } from '@angular/common'
import { ActivatedRoute } from '@angular/router';
import { reduce } from 'rxjs/operators';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { resolveMx } from 'dns';
import { DateSelectionModelChange } from '@angular/material/datepicker';


@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit {

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  active = 1;
  Admin:boolean;

  GShipPickup:boolean;
  GShipMarkup:number;
  GShipMarkupType:number;
  LabelFormatSize:string="Format_4x6";
  GShipTrackingUrl:string;
  GShipAutoPrint:boolean=false;

  WarehouseAdmin:boolean = JSON.parse(localStorage.getItem('user'))[0]["WarehouseAdmin"];
  TwoShipAPIMode = JSON.parse(localStorage.getItem('user'))[0]["TwoShipAPIMode"];
  TwoShipAPIKey = localStorage.getItem('TwoShipAPIKey')

  constructor(private service:SharedService, private route: ActivatedRoute, private modalService: NgbModal) { }

  ShowPlaceOrderButton:boolean = true;

  ActivateOrderPackageComp:boolean=false;
  ActivateOrderPackageItemComp:boolean=false;
  ActivateTransferOrderWarehouseComp:boolean=false;
  ActivateEditItemComp:boolean=false;

  ActivatePickItemComp:boolean=false;
  ModalTitle:string;
  Item:any;

  RateRequestResponse: any=[];

  ItemType:string;
  
  PrintersList: any=[];
  ClientsList: any=[];
  OrderItemsList: any=[];
  OrderItemsUnpackedList:any=[];
  PackagesList: any=[];
  PackageContentsList: any=[];
  MasterInventoryList: any=[];
  UnitsOfMeasuresList: any=[];
  InventoryList: any=[];
  AccountsList: any=[];
  CarriersList: any=[];
  ServicesList: any=[];
  KitsList: any=[];
  Type:string="Order";

  ErrorMessage:string;

  wid: any = localStorage.getItem('SelectedWarehouseId');

  PackageId:number;
  PackageGS1:string;

  module:string;

  id:number; //Manually set because not receiving any input from Order compomonent where it is actually set
  Reference1:string=null;
  Reference2:string=null;
  BillOfLadingNumber:string=null;
  CustomerPONumber:string=null;
  POType:string=null;
  DepositorOrderNumber:string=null;
  WarehouseNotes:string=null;
  InternalNotes:string=null;
  OrderDate:Date=new Date();
  RequestedShipDate:Date=null
  ShippedDate:Date=null;
  ExpectedArrivalDate:Date=null;
  CancelDate:Date=null
  ExportedToTLS:boolean;
  ExportToTLSPrefix:string;

  CustomerId:number=0;
  CustomerName:string=null;
  Partner:string=null;

  CarrierVendorId:number=0;
  CarrierName:string=null;
  CarrierAddressLine1:string=null;
  CarrierAddressLine2:string=null;
  CarrierCity:string=null;
  CarrierZip:string=null;
  CarrierState:string=null;
  CarrierCountry:string=null;
  CarrierContactName:string=null;
  CarrierContactEmail:string=null;
  CarrierContactPhone:string=null;
  CarrierSCAC:string=null;
  CarrierTrackingNumber:string=null;
  CarrierFreightCharges:number;

  ShipToCustomerId:number=0;
  ShipToName:string=null;
  ShipToAttention:string=null;
  ShipToAddress1:string=null;
  ShipToAddress2:string=null;
  ShipToCity:string=null;
  ShipToState:string=null;
  ShipToZip:string=null;
  ShipToCountry:string=null;
  ShipToContactName:string=null;
  ShipToContactEmail:string=null;
  ShipToContactPhone:string=null;
  ShipToGS1Prefix:string=null;
  ShipToDCNumber:string=null;
  ShipToStoreNumber:string=null;

  AppointmentDate:Date=null;
  AppointmentNumber:string=null;


  Weight:number=0;
  WeightUnitofMeasure:number;
  CubedWeight:number=0;

  Status:string;
  ShippingServiceId:number;
  ShippingServiceName:string;

  //Order panel
  SelectedSKU:any=[]; //Master Inventory Item Object
  SelectedKit:any=[];

  GShipPackages:any=[];

  SpecificSelectedQuantity:any=[];
  PackingQuantity:any=[];
  AutoPackQuantity:any=[];
  SelectedQuantity:number;
  SelectedUOM:any=[]; //UOM Object
  SelectedAllocation:boolean=false;

  PickedRemaining:number;

  EnableSKU:boolean=true;
  EnableKit:boolean=false;

  UPSPickupType:number;
  PurolatorLoadingDockAvailable:boolean;
  PurolatorTrailer53Accessible:boolean;
  PurolatorStreetNumber:string;
  PurolatorStreetType:string;

  OpenTime:string;
  CloseTime:string;
  PickupDate:Date;
  EnableMarkup:boolean=false;
  PrinterLocation:string;

  GShipShipButtonEnable:boolean = true;

  

  WarehouseJsonObject = JSON.parse(localStorage.getItem('WarehouseJsonObject'));

  ngOnInit(): void {
    this.refreshMasterInventoryList();
    //this.SelectedSKU.id = 0; //Required to hide the UOM dropdown for now

    this.refreshAccountsList();
    this.refreshCarriersList();
    this.refreshClientsList();
    this.refreshServicesList();
    this.refreshKitsList();
    this.refreshPackageItemsFromOrder();
    
    //
    this.SelectedQuantity = 0;
    this.SelectedSKU = "";
    this.SelectedUOM = [];
    this.SelectedKit = "";
    //

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.id = this.route.snapshot.params['OrderId']; //Will always be UNDEFINED unless set in URL
    this.module = this.route.snapshot.params['Module'];
      
    this.Admin = JSON.parse(localStorage.getItem('user'))[0]["Admin"];

    this.service.GetSystemConfig("ExportToTLSPrefix").subscribe(data=>{
      this.ExportToTLSPrefix = data.toString();
    });

    if (this.module != undefined){
      switch (this.module){
        case "Items":
          this.active = 3;
          break;

        case "Shipping":
          this.active = 1;
          break;

        case "Carrier":
          this.active = 2;
          break;

        case "Billing":
          this.active = 4;
          break;

        case "Packing":
          this.active = 5;
          break;

        case "Allocations":
          this.active = 6;
          break;

        case "Documents":
          this.active = 7;

        case "Reports":
          this.active = 8;

        case "Labels":
          this.active = 9;

        case "GShip":
          this.active = 10;
      }
    }

    if (this.id!=undefined) //ID is set, therefore we need to load the Order information
    {
      this.refreshOrder();
    } 

    this.OpenTime = this.WarehouseJsonObject.BuildingOpenTime
    this.CloseTime = this.WarehouseJsonObject.BuildingCloseTime

    this.refreshPrintersList();
  }

  refreshPrintersList(){
    this.service.getPrintersList().subscribe(data=>{
      this.PrintersList = data;
    })
  }

  refreshKitsList(){
    this.service.getKits(this.wid).subscribe(data=>{
      this.KitsList = data
    })
  }

  validationCheck(){
    if (this.Weight != 0 && !this.WeightUnitofMeasure){
      return false;
    }

    if (this.wid == 5087 && ((!this.ExpectedArrivalDate || !this.RequestedShipDate) || (!this.CarrierSCAC)) )
    {
      return false;
    }
  }

  placeOrder(){
    var val = { 
      Status:'OPEN',
      id:this.id,
      Reference1:this.Reference1,
      Reference2:this.Reference2,
      CustomerPONumber:this.CustomerPONumber,
      POType:this.POType,
      DepositorOrderNumber:this.DepositorOrderNumber,
      WarehouseNotes:this.WarehouseNotes,
      InternalNotes:this.InternalNotes,
      OrderDate:this.OrderDate,
      RequestedShipDate:this.RequestedShipDate,
      ExpectedArrivalDate:this.ExpectedArrivalDate,
      CancelDate:this.CancelDate,
      ShipToCustomerId:this.ShipToCustomerId,
      ShipToName:this.ShipToName,
      ShipToAttention:this.ShipToAttention,
      ShipToAddress1:this.ShipToAddress1,
      ShipToAddress2:this.ShipToAddress2,
      ShipToCity:this.ShipToCity,
      ShipToState:this.ShipToState,
      ShipToZip:this.ShipToZip,
      ShipToCountry:this.ShipToCountry,
      ShipToContactName:this.ShipToContactName,
      ShipToContactEmail:this.ShipToContactEmail,
      ShipToContactPhone:this.ShipToContactPhone,
      ShipToDCNumber:this.ShipToDCNumber,
      ShipToStoreNumber:this.ShipToStoreNumber,

      CustomerId:this.CustomerId,
      BillOfLadingNumber:this.BillOfLadingNumber,

      CarrierVendorId:this.CarrierVendorId,
      CarrierName:this.CarrierName,
      CarrierAddressLine1:this.CarrierAddressLine1,
      CarrierAddressLine2:this.CarrierAddressLine2,
      CarrierCity:this.CarrierCity,
      CarrierZip:this.CarrierZip,
      CarrierState:this.CarrierState,
      CarrierCounty:this.CarrierCountry,
      CarrierContactName:this.CarrierContactName,
      CarrierContactEmail:this.CarrierContactEmail,
      CarrierContactPhone:this.CarrierContactPhone,
      CarrierSCAC:this.CarrierSCAC,
      CarrierTrackingNumber:this.CarrierTrackingNumber,
      CarrierFreightCharges:this.CarrierFreightCharges,
    
      Weight:this.Weight,
      WeightUnitofMeasure:this.WeightUnitofMeasure,
    
      ShippingServiceId:this.ShippingServiceId,
      ShippingServiceName:this.ShippingServiceName};

    this.service.addOrder(val, localStorage.getItem('SelectedWarehouseId')).subscribe(res=>{
      var PlacedOrderID = res.toString();

      alert("Placed Order: " + PlacedOrderID)

      this.ShowPlaceOrderButton = false;
      
      //Count for refresh at end
      let counti = 0;

      this.OrderItemsList.forEach( (i) => {

        var item = {
          InventoryId:i.InventoryId,
          OrderID:PlacedOrderID,
          ItemId:i.ItemId,
          OrderedQuantity: i.OrderedQuantity,
          UnitofMeasureId: i.UnitsofMeasureId, //Must call it Unit instead of Units or the WebAPI will not recognize
          UnitOfMeasureId: i.UnitsofMeasureId,
          AutoAllocation: i.AutoAllocation,
          KitId:i.KitId,
          KitRef: i.KitRef
        }

        this.service.addOrderItem(item, PlacedOrderID).subscribe(res=>{

          //alert(res.toString())
          var OrderItemId = res.toString();

          var item2 = {
            InventoryId:i.InventoryId,
            OrderID:PlacedOrderID,
            ItemId:i.ItemId,
            OrderedQuantity: i.OrderedQuantity,
            UnitofMeasureId: i.UnitsofMeasureId, //Must call it Unit instead of Units or the WebAPI will not recognize
            UnitOfMeasureId: i.UnitsofMeasureId,
            AutoAllocation: i.AutoAllocation,
            OrderItemId: OrderItemId
          }

          this.service.allocateItem(item2, this.wid).subscribe(res=>{
            //alert(res.toString())
          });

          //Refresh at end
          counti++;
          if (this.OrderItemsList.length == counti){
            window.location.href = "/Orders/"+this.wid+"/"+PlacedOrderID
          }
        });
      });

      //Remember if this runs, it will execute before the subscribe() events return, and no items will be posted
      //window.location.href = "/Orders/"+this.wid+"/"+PlacedOrderID
    });
  }

  setOrderOpen(id){
    let val = {
      id:this.id
    }

    this.service.setOrderOpen(val).subscribe(res=>{
      alert(res);
      location.reload();
    })
  }

  setOrderShipped(id){
    let val = {
      id:this.id
    }

    this.service.setOrderShipped(val).subscribe(res=>{
      alert(res);
      location.reload();
    })
  }

  refreshOrder(){
    this.service.getOrder(this.wid, this.id).subscribe(res=>
      {
        //Look the order information into the variales
        this.Status = res[0].Status
        this.Reference1 = res[0].Reference1;
        this.Reference2 = res[0].Reference2;
        this.BillOfLadingNumber = res[0].BillOfLadingNumber;
        this.CustomerPONumber = res[0].CustomerPONumber;
        this.POType = res[0].POType;
        this.DepositorOrderNumber = res[0].DepositorOrderNumber;
        this.WarehouseNotes = res[0].WarehouseNotes;
        this.InternalNotes = res[0].InternalNotes;
        this.OrderDate = res[0].OrderDate;
        this.RequestedShipDate = res[0].RequestedShipDate;
        this.ExpectedArrivalDate = res[0].ExpectedArrivalDate;
        this.CancelDate = res[0].CancelDate;
        this.ExportedToTLS = res[0].ExportedToTLS;
        this.ShipToCustomerId = res[0].ShipToCustomerId;
        this.ShipToName = res[0].ShipToName;
        this.ShipToAttention = res[0].ShipToAttention;
        this.ShipToAddress1 = res[0].ShipToAddress1;
        this.ShipToAddress2 = res[0].ShipToAddress2;
        this.ShipToCity = res[0].ShipToCity;
        this.ShipToState = res[0].ShipToState;
        this.ShipToZip = res[0].ShipToZip;
        this.ShipToCountry = res[0].ShipToCountry;
        this.ShipToContactName = res[0].ShipToContactName;
        this.ShipToContactEmail = res[0].ShipToContactEmail;
        this.ShipToContactPhone = res[0].ShipToContactPhone;
        this.ShipToGS1Prefix = res[0].ShipToGS1Prefix;
        this.ShipToDCNumber = res[0].ShipToDCNumber;
        this.ShipToStoreNumber = res[0].ShipToStoreNumber;
        this.ShippedDate = res[0].ShippedDate;
        this.AppointmentDate = res[0].AppointmentDate;
        this.AppointmentNumber = res[0].AppointmentNumber;

        this.Weight = res[0].Weight;
        this.WeightUnitofMeasure = res[0].WeightUnitofMeasure;
        this.CubedWeight = res[0].CubedWeight

        this.CustomerId = res[0].CustomerId;
        this.CustomerName = res[0].CustomerName;
        this.Partner = res[0].Partner;

        this.CarrierVendorId=res[0].CarrierVendorId;
        this.CarrierName=res[0].CarrierName;
        this.CarrierAddressLine1=res[0].CarrierAddressLine1;
        this.CarrierAddressLine2=res[0].CarrierAddressLine2;
        this.CarrierCity=res[0].CarrierCity;
        this.CarrierZip=res[0].CarrierZip;
        this.CarrierState=res[0].CarrierState;
        this.CarrierCountry=res[0].CarrierCountry;
        this.CarrierContactPhone=res[0].CarrierContactPhone;
        this.CarrierContactEmail=res[0].CarrierContactEmail;
        this.CarrierContactName=res[0].CarrierContactName;
        this.CarrierSCAC=res[0].CarrierSCAC;
        this.CarrierTrackingNumber=res[0].CarrierTrackingNumber;
        this.CarrierFreightCharges=res[0].CarrierFreightCharges;

        this.ShippingServiceId = res[0].ShippingServiceId;
        this.ShippingServiceName = res[0].ShippingServiceName;

        this.PickedRemaining = res[0].PickedRemaining;

        this.refreshOrderItems();
      });
  }

  updateOrder(){    
    var val = { id:this.id,
                Status:this.Status,
                Reference1:this.Reference1,
                Reference2:this.Reference2,
                CustomerPONumber:this.CustomerPONumber,
                POType:this.POType,
                DepositorOrderNumber:this.DepositorOrderNumber,
                WarehouseNotes:this.WarehouseNotes,
                InternalNotes:this.InternalNotes,
                OrderDate:this.OrderDate,
                RequestedShipDate:this.RequestedShipDate,
                ExpectedArrivalDate:this.ExpectedArrivalDate,
                CancelDate:this.CancelDate,
                ShipToCustomerId:this.ShipToCustomerId,
                ShipToName:this.ShipToName,
                ShipToAttention:this.ShipToAttention,
                ShipToAddress1:this.ShipToAddress1,
                ShipToAddress2:this.ShipToAddress2,
                ShipToCity:this.ShipToCity,
                ShipToState:this.ShipToState,
                ShipToZip:this.ShipToZip,
                ShipToCountry:this.ShipToCountry,
                ShipToContactName:this.ShipToContactName,
                ShipToContactEmail:this.ShipToContactEmail,
                ShipToContactPhone:this.ShipToContactPhone,
                ShipToGS1Prefix:this.ShipToGS1Prefix,
                ShipToStoreNumber:this.ShipToStoreNumber,
                ShipToDCNumber:this.ShipToDCNumber,

                CustomerId:this.CustomerId,
                BillOfLadingNumber:this.BillOfLadingNumber,

                CarrierVendorId:this.CarrierVendorId,
                CarrierName:this.CarrierName,
                CarrierAddressLine1:this.CarrierAddressLine1,
                CarrierAddressLine2:this.CarrierAddressLine2,
                CarrierCity:this.CarrierCity,
                CarrierZip:this.CarrierZip,
                CarrierState:this.CarrierState,
                CarrierCounty:this.CarrierCountry,
                CarrierContactName:this.CarrierContactName,
                CarrierContactEmail:this.CarrierContactEmail,
                CarrierContactPhone:this.CarrierContactPhone,
                CarrierSCAC:this.CarrierSCAC,
                CarrierTrackingNumber:this.CarrierTrackingNumber,
                CarrierFreightCharges:this.CarrierFreightCharges,
              
                Weight:this.Weight,
                WeightUnitofMeasure:this.WeightUnitofMeasure,
                
                ShippingServiceId:this.ShippingServiceId,
                ShippingServiceName:this.ShippingServiceName,
                AppointmentDate:this.AppointmentDate,
                AppointmentNumber:this.AppointmentNumber,
                CubedWeight:this.CubedWeight};
      
    this.service.updateOrder(val).subscribe(res=>
    {
      //alert(res.toString())

      var PlacedOrderID = res.toString();
      //alert(PlacedOrderID);

      this.OrderItemsList.forEach( (i) => 
      {
        if (i.updateRequired == true)
        {
          var item = 
          {
            InventoryId:i.InventoryId,
            OrderID:PlacedOrderID,
            ItemId:i.ItemId,
            OrderedQuantity: i.OrderedQuantity,
            UnitOfMeasureId: i.UnitsofMeasureId,
            AutoAllocation: i.AutoAllocation,
            KitId:i.KitId,
            KitRef: i.KitRef
          }

          this.service.addOrderItem(item, PlacedOrderID).subscribe(res=>
          {
            //alert(res.toString());

            var OrderItemId = res.toString();

            var item2 = {
              InventoryId:i.InventoryId,
              OrderID:PlacedOrderID,
              ItemId:i.ItemId,
              OrderedQuantity: i.OrderedQuantity,
              UnitofMeasureId: i.UnitsofMeasureId, //Must call it Unit instead of Units or the WebAPI will not recognize
              UnitOfMeasureId: i.UnitsofMeasureId,
              AutoAllocation: i.AutoAllocation,
              OrderItemId: OrderItemId
            }

            //Jan 5th, wondering why this is called everytime we UpdateOrder()
            this.service.allocateItem(item2, this.wid).subscribe(res=>{
              //alert(res.toString())
            });

            this.refreshOrder();
            this.refreshOrderItems();
            this.refreshOrderItemsUnpacked();
          });
        }

        
      });
    });
  }

  refreshPackageItemsFromOrder(){
    this.service.getOrderPackageItemsFromOrder(this.id).subscribe(data=>{
      data.forEach((i) =>{
        this.GShipPackages.push({
          Weight: i.Expr1,
          Width: i.Width,
          Length: i.Length,
          Height: i.Height,
          IsStackable: true,
          Reference1: i.id,
          Reference2: i.SSCC18
        });
      });
    })
  }

  //2Ship Integration
  GShipRate(){
    //this.RateRequestResponse = null;

    let WarehouseName = (localStorage.getItem('WarehouseName'));
    let WarehouseAddress1 = (localStorage.getItem('WarehouseAddress1'));
    let WarehouseCity = (localStorage.getItem('WarehouseCity'));
    let WarehouseState = (localStorage.getItem('WarehouseState'));
    let WarehouseZip = (localStorage.getItem('WarehouseZip'));
    let WarehouseCountry = (localStorage.getItem('WarehouseCountry'));
    let WarehousePhone = (localStorage.getItem('WarehousePhone'));

    let WarehouseJsonObject = JSON.parse(localStorage.getItem('WarehouseJsonObject'));
    
    this.ErrorMessage = "Calculating Packages (DIMs and Weight). Please wait...";

    this.service.getOrderPackageItemsFromOrder(this.id).subscribe(data=>{
      data.forEach((i) =>{
        this.GShipPackages.push({
          Weight: i.Expr1,
          Width: i.Width,
          Length: i.Length,
          Height: i.Height,
          IsStackable: true,
          Reference1: i.id,
          Reference2: i.SSCC18
        })
      })

      this.ErrorMessage = "Packages Calculated";

      var Request = {
        WS_Key:this.TwoShipAPIKey,
        Sender: {
          Country: WarehouseCountry,
          State: WarehouseState,
          City: WarehouseCity,
          PostalCode: WarehouseZip,
          Address1: WarehouseAddress1,
          CompanyName: WarehouseName,
          Telephone: WarehousePhone,
          IsResidential: false
        },
        Recipient: {
          Country: this.ShipToCountry,
          State: this.ShipToState,
          City: this.ShipToCity,
          PostalCode: this.ShipToZip,
          Address1: this.ShipToAddress1,
          CompanyName: this.ShipToName,
          Telephone: this.ShipToContactPhone,
          IsResidential: true
        },
        Packages: this.GShipPackages,
        PickupRequest: this.GShipPickup,
        CustomerMarkups: {
          CarrierId:0,
          MarkupValue: this.GShipMarkup,
          MarkupType: this.GShipMarkupType
        }
      };
  
      this.ErrorMessage = "Rate Request Sent to All Carriers. Please wait...";
      this.service.TwoShipRateSummary(Request).subscribe(data=>{
        this.ErrorMessage = 'Rate Request Complete.';
        this.RateRequestResponse = data;       
      }, 
      error => {
        let MessageString = "ERROR: " + error;       
        alert(MessageString);
        this.ErrorMessage = MessageString;
      })
    });
  }

  GShipHold(dataItem, item){
    this.ErrorMessage="Hold Request Sent. Please wait 15 seconds...";
    let OrderNumber = this.id;
    let ServiceName = item.ServiceName;
    let ServiceCode = item.ServiceCode;
    let CarrierName = dataItem.CarrierName;
    let CarrierId = dataItem.CarrierId;
    let Cost = item.TotalClientPriceInSelectedCurrency;

    let WarehouseName = (localStorage.getItem('WarehouseName'));
    let WarehouseAddress1 = (localStorage.getItem('WarehouseAddress1'));
    let WarehouseCity = (localStorage.getItem('WarehouseCity'));
    let WarehouseState = (localStorage.getItem('WarehouseState'));
    let WarehouseZip = (localStorage.getItem('WarehouseZip'));
    let WarehouseCountry = (localStorage.getItem('WarehouseCountry'));
    let WarehousePhone = (localStorage.getItem('WarehousePhone'));

    if(window.confirm("HOLD: " + ServiceName  + " with " + CarrierName + " for $" + Cost)){
      //Two fields, CarrierId and ServiceCode based on the results from the Rate
      var Request = {
        WS_Key:this.TwoShipAPIKey,
        //OrderNumber: OrderNumber, //Prevents double shipping.
        CarrierId: CarrierId,
        ServiceCode: ServiceCode,
        Sender: {
          Country: WarehouseCountry,
          State: WarehouseState,
          City: WarehouseCity,
          PostalCode: WarehouseZip,
          Address1: WarehouseAddress1,
          CompanyName: WarehouseName,
          Telephone: WarehousePhone,
          IsResidential: false
        },
        Recipient: {
          Country: this.ShipToCountry,
          State: this.ShipToState,
          City: this.ShipToCity,
          PostalCode: this.ShipToZip,
          Address1: this.ShipToAddress1,
          CompanyName: this.ShipToName,
          Telephone: this.ShipToContactPhone,
          IsResidential: true
        },
        Packages: this.GShipPackages,
        PickupRequest: this.GShipPickup,
        CustomerMarkups: {
          CarrierId:0,
          MarkupValue: this.GShipMarkup,
          MarkupType: this.GShipMarkupType
        }
      };
  
      this.service.TwoShipHold(Request).subscribe(data=>
      {
        let HoldShipmentId = data['HoldShipmentId'];

        var GShipHoldObject = {
            WarehouseId: this.wid,
            Status:'Hold',
            ShipId:HoldShipmentId,
            OrderId:this.id
        };

        this.service.CreateGShip(this.wid, GShipHoldObject).subscribe(res=>
        {
          alert(res);
          this.ErrorMessage="";
        })

      },
      error => {
        let MessageString = "ERROR: " + error;
        
        alert(MessageString);
        this.ErrorMessage = MessageString;
      });
    }
  }

  GShipShip(dataItem, item){
    let WarehouseJsonObject = JSON.parse(localStorage.getItem('WarehouseJsonObject'));
    
    let OrderNumber = this.id
    let ServiceName = item.ServiceName;
    let ServiceCode = item.ServiceCode;
    let CarrierName = dataItem.CarrierName;
    let CarrierId = dataItem.CarrierId;
    let Cost = item.TotalClientPriceInSelectedCurrency;

    let WarehouseName = (localStorage.getItem('WarehouseName'));
    let WarehouseAddress1 = (localStorage.getItem('WarehouseAddress1'));
    let WarehouseCity = (localStorage.getItem('WarehouseCity'));
    let WarehouseState = (localStorage.getItem('WarehouseState'));
    let WarehouseZip = (localStorage.getItem('WarehouseZip'));
    let WarehouseCountry = (localStorage.getItem('WarehouseCountry'));
    let WarehousePhone = (localStorage.getItem('WarehousePhone'));
    let WarehouseEmail = WarehouseJsonObject['ContactEmail'];

    if(window.confirm("SHIP: " + ServiceName  + " with " + CarrierName + " for $" + Cost)){
      this.ErrorMessage = "Ship Request Sent. Please wait 15 seconds...";
      //Two fields, CarrierId and ServiceCode based on the results from the Rate
      var Request = {
        WS_Key:this.TwoShipAPIKey,
        ShipmentReference: OrderNumber, //Roland thinks this feild appears on invoice, they need to match invoice to WMS order
        ShipmentReference2: this.DepositorOrderNumber,
        OrderNumber: OrderNumber, //Prevents double shipping.
        ShipmentPONumber: this.CustomerPONumber,
        CarrierId: CarrierId,
        ServiceCode: ServiceCode,
        Sender: {
          Country: WarehouseCountry,
          State: WarehouseState,
          City: WarehouseCity,
          PostalCode: WarehouseZip,
          Address1: WarehouseAddress1,
          CompanyName: WarehouseName,
          Telephone: WarehousePhone,
          ContactName: WarehouseName,
          Email: WarehouseEmail,
          IsResidential: false
        },
        Recipient: {
          Country: this.ShipToCountry,
          State: this.ShipToState,
          City: this.ShipToCity,
          PostalCode: this.ShipToZip,
          Address1: this.ShipToAddress1,
          CompanyName: this.ShipToName,
          ContactName: this.ShipToContactName,
          Telephone: this.ShipToContactPhone,
          IsResidential: true
        },
        Packages: this.GShipPackages,      
        PickupRequest: {
          /*
          RequestAPickup:this.GShipPickup,
          ReadyTime:this.OpenTime,
          CompanyCloseTime:this.CloseTime,
          */
        },
        CustomerMarkups: {
          CarrierId:0,
          MarkupValue: this.GShipMarkup,
          MarkupType: this.GShipMarkupType
        },
        LabelPrintPreferences:{
          OutputFormat:this.LabelFormatSize
        }
      };
  
      if (this.GShipPickup){
        Request.PickupRequest['RequestAPickup'] = this.GShipPickup
        Request.PickupRequest['ReadyTime'] = this.OpenTime
        Request.PickupRequest['CompanyCloseTime'] = this.CloseTime;
      }

      if (this.PickupDate){
        Request.PickupRequest['PickupDate'] = this.PickupDate
      }

      switch (CarrierName){
        case "Purolator":
          Request.PickupRequest['PurolatorPickupRequest']= {
            StreetNumber: this.PurolatorStreetNumber,
            StreetType: this.PurolatorStreetType,
            LoadingDockAvailable:this.PurolatorLoadingDockAvailable,
            Trailer53Accessible:this.PurolatorTrailer53Accessible
          }
        case "UPS":
          Request.PickupRequest['UPSPickupRequest'] = {
            OverweightIndicator:false,
            UPSPickupType:this.UPSPickupType
          }
      }

      //2Ship SHIP
      this.service.TwoShipShip(Request).subscribe(data=>
      {      
        this.ErrorMessage = 'GShip WMS Object Being Created.';   

        var GShipShipObject = {
          WarehouseId: this.wid,
          OrderId: this.id,
          ShipId:data['ShipId'],
          Status:data['Status'],
          LabelUrl: data['ShipDocuments'][0].Href,
          LabelAutoPrintUrl:data['ShipDocuments'][0].AutoPrintUrl,
          TrackingNumber:data['TrackingNumber'],
          TrackingUrl:data['TrackingUrl'],
          LocationId:data['LocationId'],
          LocationName:data['LocationName'],         
          CarrierName:data['Service'].CarrierName,
          CarrierId:data['Service'].CarrierId,
          TransitDays:data['Service'].TransitDays,
          ServiceCode:data['Service'].Service['Code'],
          ServiceName:data['Service'].Service['Name'],        
          CustomerPrice:data['Service'].CustomerPrice['TotalPriceInSelectedCurrency'],
          ClientPrice:data['Service'].ClientPrice['TotalPriceInSelectedCurrency'],
          BilledWeight:data['Service'].ClientPrice['BilledWeight'],
          ListPrice:data['Service'].ListPrice['TotalPriceInSelectedCurrency'],
          Currency:data['Service'].ListPrice['Currency'],
          ShipDate:data['ShipmentDetails'].ShipDate,
          LabelGenerationDate:data['ShipmentDetails'].LabelGenerationDate,
          PickupScheduled:this.GShipPickup,
          PickupNumber:data['ShipmentDetails'].PickupNumber,
          PrinterLocation:this.PrinterLocation
        };

        //They return this date instead of returning an empty value. So we need to remove this from the request.
        if(data['Service'].DeliveryDate != '0001-01-01T00:00:00Z'){
          GShipShipObject['DeliveryDate'] = data['Service'].DeliveryDate;
        }

        //Save Shipment details to GShip WMS
        this.service.CreateGShip(this.wid, GShipShipObject).subscribe(res=>{
          let GShipId = res.toString();
          //alert("GShipment Placed ID:" + GShipId);
          this.ErrorMessage = "GShipment Placed ID:" + GShipId;
          this.GShipShipButtonEnable = false;
          this.GShipTrackingUrl = data['ShipDocuments'][0].Href;

          if (this.GShipAutoPrint){
            //open url in new tab
            window.open(data['ShipDocuments'][0].AutoPrintUrl, "_blank");
          }

          for (let i=0; i<this.GShipPackages.length; i++)
          {
            var Package = {
              GShipId:GShipId,
              OrderId:this.id,
              TrackingNumber:data['PackageTrackingNumbers'][i],
              Reference1:data['ShipmentDetails'].Packages[i].Reference1,
              Reference2:data['ShipmentDetails'].Packages[i].Reference2,
              Length:data['ShipmentDetails'].Packages[i].Length,
              Width:data['ShipmentDetails'].Packages[i].Width,
              Height:data['ShipmentDetails'].Packages[i].Height,
              Weight:data['ShipmentDetails'].Packages[i].Weight
            }

            //Save Package details to GShip WMS
            this.service.CreateGShipPackage(Package).subscribe(res=>{
              //alert("Package: " + res.toString());
              //this.ErrorMessage="";
              //this.ErrorMessage = "GShipment Package ID:" + res.toString();
            });
          }
        })

        //If a pickup was set, there will be the label[1] array with pickup slip
        if (this.GShipPickup){
          var PickupObject = {
            WarehouseId: this.wid,
            PickupNumber:data['ShipmentDetails'].PickupNumber,
            LabelUrl: data['ShipDocuments'][1].Href,
            LabelAutoPrintUrl:data['ShipDocuments'][1].AutoPrintUrl,
            CarrierName:data['Service'].CarrierName,
            CarrierId:data['Service'].CarrierId,
            //PickupDate:data['']
          }

          this.service.CreatePickup(PickupObject, this.wid).subscribe(data=>{
            alert("Created Pickup " + data);
          })
        }

        
      },
      error => {
        let MessageString = "ERROR: " + error;
        
        alert(MessageString);
        this.ErrorMessage = MessageString;
      });
    }
  }


  GShipRateSample(){
    var Request = {
        //WS_Key: "BB6583EA-4F33-4595-A03D-4B0295D1E471",
        WS_Key:this.TwoShipAPIKey,
        Sender: {
          Country: "CA",
          State: "ON",
          City: "Mississauga",
          PostalCode: "L5T 2S8",
          Address1: "6225 Kennedy Road",
          CompanyName: "GAPP Express",
          IsResidential: false
        },
        Recipient: {
          Country: "CA",
          State: "ON",
          City: "Barrie",
          PostalCode: "L4N 9G1",
          Address1: "729 Essa Rd",
          CompanyName: "Stefon",
          IsResidential: true
        },
        Packages: [
          {
            Weight: 1.0,
            Width: 2.0,
            Length: 3.0,
            Height: 4.0,
            "IsStackable": true
          }
        ]
    };

    this.service.TwoShipRateSummary(Request).subscribe(data=>{
      this.RateRequestResponse = data;
    })
  }

  autoAllocate(){
    if (window.confirm("This will run the allocation against every line item where the Allocated Quantity is LESS than the Ordered Quanttiy.")){
      this.OrderItemsList.forEach( (i) =>
      {
        if(i.QuantityAllocated < i.OrderedQuantity){
          var item2 = {
            OrderID:this.id,
            ItemId:i.ItemId,
            OrderedQuantity: i.OrderedQuantity,
            UnitofMeasureId: i.UnitsofMeasureId, //Must call it Unit instead of Units or the WebAPI will not recognize
            UnitOfMeasureId: i.UnitsofMeasureId,
            AutoAllocation: true, //We must override this setting to TRUE or the WebAPI won't process it
            OrderItemId: i.id
          }

          this.service.allocateItem(item2, this.wid).subscribe(res=>{
            alert(res.toString())
            this.refreshOrderItems();
          });
        }
      })
    }
  }
  
  exportToTLS(item){
    let proceed = false;
    let OrderId = item.id;
    let TLSWaybillId = this.ExportToTLSPrefix+OrderId;

    if (item.ExportedToTLS >= 1){
      if(window.confirm('This Order has already been sent to TLS ' + item.ExportedToTLS + ' times. Do you want to send again?')){
        proceed = true;
      }
    }
    else{
      if(window.confirm('Are you sure you want to send Order: ' +OrderId+ ' to TLS as Waybill: ' + TLSWaybillId)){
        proceed = true;
      }
    }

    if (proceed == true){     

      var WaybillHeader = { 
        waybill:TLSWaybillId,
        reference:item.Reference1 + item.CustomerPONumber,
        rstatus:"OPEN",
        oedate:item.OrderDate,
        apptdate:item.OrderDate,
        oetime:""
      };
      this.service.TLSCreateWaybillHeader(WaybillHeader).subscribe(data=>{
        //alert("Header " + data.toString());
      },error => {
        alert("Header Error - " + error);
      })

      var WaybillBillTo = {
        waybill:TLSWaybillId,
        type:"H",
        custno:"GAPP",
        company:"GAPP Express",
        contact:"Roland",
        address1:"6225 Kennedy Read",
        city:"Mississauga",
        state:"ON",
        zip:"L5T2S8",
        country:"CA"
      };
      this.service.TLSCreateWaybillBillTo(WaybillBillTo).subscribe(data=>{
        //alert("BillTo " + data.toString());
      },error => {
        alert("Bill To Error - " + error);
      })

      var WaybillPickup = {
        waybill:TLSWaybillId,
        type:"P",
        custno:"GAPP",
        company:"GAPP Express",
        contact:"Roland",
        address1:"6225 Kennedy Read",
        city:"Mississauga",
        state:"ON",
        zip:"L5T2S8",
        country:"CA"
      }
      this.service.TLSCreateWaybillPickup(WaybillPickup).subscribe(data=>{
        //alert("Pickup " + data.toString());
      },error => {
        alert("Pickup Error - " + error);
      })

      var WaybillShipTo = {
        waybill:TLSWaybillId,
        type:"S",
        custno:"",
        company:item.ShipToName,
        contact:"",
        address1:item.ShipToAddress1,
        city:item.ShipToCity,
        state:item.ShipToState,
        zip:item.ShipToZip,
        country:item.ShipToCountry
      }
      this.service.TLSCreateWaybillShipTo(WaybillShipTo).subscribe(data=>{
        //alert("ShipTo " + data.toString());
      },error => {
        alert("Ship To Error - " + error);
      })

      let peices = 0;
      
      this.OrderItemsList.forEach( (i) => {
        peices +=1;
        //alert(peices);

        var WaybillDimensionLine = 
        {
          waybill:TLSWaybillId,
          type:"SC",
          pieces:i.OrderedQuantity,
          weight:0, //Remember that the Unit is not set at the line item, but in TLS it is set for all the lines
          cubewgt:0,
          skids:0,
          length:i.Length,
          width:i.Width,
          height:i.Height,
          offrate:0,
          descroth:i.SKU + " (" + i.ItemId + ") " + i.UnitsofMeasureId
        }
        this.service.TLSCreateWaybillDimensionLines(WaybillDimensionLine).subscribe(data=>{
          //alert("Line Item " + data.toString());
        },error => {
          alert("Cube Line Error - " + error);
        })

      });


      var WaybillRevenue = {
      waybill:TLSWaybillId,
      type:"SR",
      shipdate:item.OrderDate,
      servcode:"EX",
      status:"OPEN",
      pieces:peices,
      weight:0,
      "cubewgt":0,
      "skids":0,
      unit:item.WeightUnitofMeasure,
      rate:0,
      baserate:0,
      sub:0,
      offrate:0,
      offbase:0,
      offsub:0,
      other:0,
      charge:0,
      pst:0,
      gst:0,
      taxable:0,
      currency:"CDN",
      ctotal:0,
      autorate:0,
      cod:0,
      declared:0,
      discamt:0,
      invtype:"INVOICE",
      paytype:"PP",
      mgty:0,
      heatamt:0,
      autosyncpcs:1,
      autofuel:0,
      autonav:0,
      autosur1:0,
      autosur2:0,
      autotax:1,
      currate:0,
      cginfo:0,
      munit:"",
      descr:"",
      custno:"",
      invoice:""
      }
      this.service.TLSCreateWaybillRevenue(WaybillRevenue).subscribe(data=>{
        //alert("Revenue " + data.toString());
      },error => {
        alert("Revenue Error - " + error);
      })

      var WaybillCost = {
      waybill:TLSWaybillId,
      type:"PE",
      route:"Pickup",
      shipdate:item.OrderDate,
      servcode:"EX",
      pieces:0,
      weight:0,
      cubewgt:0,
      skids:0,
      unit:"LB",
      currate:1,
      ctotal:0,
      autorate:0,
      invtype:"Invoice",
      paytype:"TP",
      munit:"MI",
      autofuel:1,
      autotax:0
      }
      this.service.TLSCreateWaybillCost(WaybillCost).subscribe(data=>{
        //alert("Cost PE " + data.toString());
      },error => {
        alert("Cost Error - " + error);
      })

      var ExportToTLSCount = {
        id:OrderId,
        ExportedToTLS:1
      }
      this.service.ExportToTLSCount(ExportToTLSCount).subscribe(data=>{
        //alert(data.toString());
      })
    }
  }

  updateCustomer(item){
    this.CustomerId = item.id;
    this.CustomerName = item.ClientName;
  }

  refreshClientsList(){
    this.service.getClientsList().subscribe(data=>{
      this.ClientsList=data;
    });
  } 

  refreshMasterInventoryList(){
    //Dec 27th change from full query to basic query.
    this.service.getMasterInventoryBasic(this.wid).subscribe(data=>{
      this.MasterInventoryList=data;
    });
  }

  selectedSKUClick(sku){
    this.refreshUOMsList();
    this.getAvailableInventoryBySKU(sku);

    this.ItemType = 'SKU';
    this.SelectedQuantity = 1;
  }

  selectedKitClick(){

    this.ItemType = 'Kit';
    this.SelectedQuantity = 1;
  }

  refreshUOMsList(){
    this.service.getUnitsofMeasuresBySKU(this.wid, this.SelectedSKU['id']).subscribe(data=>{
      this.UnitsOfMeasuresList=data;

      //Reset the other information after selecting a new SKU. This is required for the SelectedUOM because it holds the previous value from the last selected item and must be reset so the user does not add it to order without first setting a UOM from the drop down.
      //this.SelectedUOM = "Select a UOM";
      this.SelectedQuantity = 1;

      this.SelectedUOM.id = data[0].id;
      this.SelectedUOM.Package = data[0].Package;
    });   
  }

  addItemToOrder(){
    if (this.ItemType == "Kit"){
      let kitId = this.SelectedKit.id;
      let kitName = this.SelectedKit.Name;

      for (let x=0; x<this.SelectedQuantity; x++)
      {
        this.service.getKitSKUsById(kitId).subscribe(data=>{

          let count = 0;

          Object.keys(data).forEach(function(key) {
            count = parseInt(key) + 1;
          });

          for (let i=0; i<count; i++){
            this.OrderItemsList.push(
            {
              updateRequired:true,
              ItemId:data[i].ItemId, 
              SKU: data[i].SKU,
              Description: data[i].Description,
              OrderedQuantity: data[i].Quantity,
              UnitsofMeasureId: data[i].UnitofMeasureId,
              UnitsofMeasurePackage: data[i].Package,
              UnitofMeasure:data[i].Package,
              AutoAllocation: this.SelectedAllocation,
              KitId: kitId,
              KitRef: (kitName + "-" + x + "-" + this.OrderItemsList.length),
            });
          }
        })
      }
    }


    if (this.ItemType == "SKU"){
      this.OrderItemsList.push(
      {
        updateRequired:true,
        ItemId:this.SelectedSKU.id, 
        SKU: this.SelectedSKU.SKU,
        OrderedQuantity: this.SelectedQuantity,
        UnitsofMeasureId: this.SelectedUOM.id,
        UnitsofMeasurePackage: this.SelectedUOM.Package,
        UnitofMeasure:this.SelectedUOM.Package,
        AutoAllocation: this.SelectedAllocation
      });

      this.SelectedQuantity = 0;
      this.SelectedSKU = "";
      this.SelectedUOM = [];

      this.SelectedKit = "";

      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    }
  }

  refreshAccountsList(){
    this.service.getAccounts("Customer").subscribe(data=>{
      this.AccountsList=data;
    });
  }

  refreshCarriersList(){
    this.service.getAccounts("Vendor").subscribe(data=>{
      this.CarriersList=data;
    });
  }

  updateShipToFromAccount(account){
    this.ShipToCustomerId = account.id
    this.ShipToName = account.Name;
    this.ShipToAddress1 = account.AddressLine1;
    this.ShipToAddress2 = account.AddressLine2;
    this.ShipToCity = account.City;
    this.ShipToZip = account.Zip;
    this.ShipToState = account.State;
    this.ShipToCountry = account.Country;
    this.ShipToContactName = account.ContactName;
    this.ShipToContactEmail = account.ContactEmail;
    this.ShipToContactPhone = account.ContactPhone;
    this.ShipToGS1Prefix = account.GS1Prefix;
  }

  updateCarrierFromAccount(account){
    this.CarrierVendorId = account.id
    this.CarrierName = account.Name;
    this.CarrierAddressLine1 = account.AddressLine1;
    this.CarrierAddressLine2 = account.AddressLine2;
    this.CarrierCity = account.City;
    this.CarrierZip = account.Zip;
    this.CarrierState = account.State;
    this.CarrierCountry = account.Country;
    this.CarrierContactName = account.ContactName;
    this.CarrierContactEmail = account.ContactEmail;
    this.CarrierContactPhone = account.ContactPhone;
    this.CarrierSCAC = account.SCAC;
  }

  deleteOrderItem(orderitemid)
  {
    if(window.confirm('Are you sure you want to delete line item ' + orderitemid +' ?'))
    {
      this.service.deleteOrderItem(this.id, orderitemid).subscribe(res=>
      {
        alert(res.toString())
        this.refreshOrderItems();
      });  

      //December 27th update because when deleting OrderItems it would not delete any Allocations that were made
      //this.service.deleteAllocationByOrderItemId(orderitemid)
    }
  }

  refreshOrderItems(){
    //Empty the array because we are going to load it with the same values again
    this.OrderItemsList = [];

    this.service.getOrderItems(this.id).subscribe(res=>
      {
        let keys = Object.keys(res);
        keys.forEach(key => 
        {
          this.OrderItemsList.push(
          {
              id:res[key].ID,
              updateRequired:false, 
              ItemId:res[key].ItemId, 
              SKU:res[key].SKU,
              Description:res[key].Description,
              OrderedQuantity: res[key].OrderedQuantity,
              UnitsofMeasureId: res[key].UnitOfMeasureId,
              UnitOfMeasureId: res[key].UnitOfMeasureId,
              UnitofMeasure: res[key].UnitofMeasure,
              AutoAllocation: res[key].AutoAllocation,
              QuantityAllocated: res[key].QuantityAllocated,
              InventoryId:res[key].InventoryId,
              Picked:res[key].Picked,
              QuantityPicked:res[key].QuantityPicked,
              QuantityPacked:res[key].QuantityPacked,
              RequestedPackQuantity:res[key].RequestedPackQuantity,
              LotNumber:res[key].LotNumber,
              KitId:res[key].KitId,
              KitRef:res[key].KitRef,
              Weight:res[key].Weight,
              Length:res[key].Length,
              Width:res[key].Width,
              Height:res[key].Height,
              EDISKU:res[key].EDISKU
          });
        });

        this.refreshPackages();
        this.refreshOrderItemsUnpacked();  
      });
  }

  getAvailableInventoryBySKU(sku){
    this.service.getAvailableInventoryBySKU(this.wid, sku).subscribe(data=>{
      this.InventoryList=data;
    });
  }

  addSpecificItemToOrder(dataItem, i)
  {
    let QuantityToAdd = dataItem.QuantityAvailable;

    if (this.SpecificSelectedQuantity[dataItem.id] != undefined){
      QuantityToAdd = this.SpecificSelectedQuantity[dataItem.id];
    }

    this.OrderItemsList.push(
    {
      InventoryId:dataItem.id,
      OrderedQuantity:QuantityToAdd,
      ItemId:dataItem.ItemId, 
      SKU: dataItem.SKU,
      Description: dataItem.Description,
      UnitsofMeasureId: dataItem.UnitsofMeasureId,
      UnitsofMeasurePackage: dataItem.Package,
      UnitofMeasure:dataItem.Package,
    
      updateRequired:true,
      AutoAllocation: false
    });
    
    this.InventoryList.splice(i,1);

    this.SelectedQuantity = 0;
    this.SelectedSKU = "";
    this.SelectedUOM = [];

    this.SelectedKit = "";

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  removeFromCart(i){
    this.OrderItemsList.splice(i,1);
  }

  pickItem(content, item){
    this.modalService.open(content);

    this.Item={
      OrderItemId:item.ID,
      InventoryId: item.InventoryId,
      QuantityAllocated: item.QuantityAllocated,
      UnitofMeasureId: item.UnitofMeasureId,
      UnitofMeasure: item.UnitofMeasure,
    }

    this.ModalTitle="Pick Item ";
    this.ActivatePickItemComp = true;
  }

  closeClick(content){
    this.modalService.dismissAll(content);
    this.ActivatePickItemComp = false;
    this.refreshOrderItems();
  }

  closePackageModal(content){
    this.modalService.dismissAll(content);
    this.ActivateOrderPackageComp = false;
    this.refreshPackages();
  }

  closePackageItemModal(content){
    this.modalService.dismissAll(content);
    this.ActivateOrderPackageItemComp = false;
    this.refreshPackageItems();
  } 

  finishPicking(item, showDialog=true){ 
    let proceed = false;

    if (showDialog)
    {
      if (item.QuantityAllocated != item.QuantityPicked){
        alert('The Allocated Quantity does not equal the Picked Quantity.');

        if (this.Admin) //Admin
        {
          if (window.confirm("Admin override?")){
              proceed = true;
          }
        }     
      }
      else{
        proceed = true;
      }

      if (proceed){
        let val = {}
        this.service.pickOrderItem(val, this.id, item.id).subscribe(res=>{
          //alert(res.toString())
          this.refreshOrderItems();
        });
      }
    }
    else {
      let val = {}
        this.service.pickOrderItem(val, this.id, item.id).subscribe(res=>{
          //alert(res.toString())
          //this.refreshOrderItems();
        });
    }
  }

  generate945XML(id, CustomerId){
    this.service.Generate945XML(id, CustomerId).subscribe(res=>{
      alert("945 XML Generated: " + res.toString());
    })
  }

  generate856XML(id, CustomerId){
    this.service.Generate856XML(id, CustomerId).subscribe(res=>{
      alert("856 XML Generated: " + res.toString());
    })
  }

  generate856ShipToXML(id, CustomerId, ShipToCustomerId){
    this.service.Generate856ShipToXML(id, CustomerId, ShipToCustomerId).subscribe(res=>{
      alert("856 XML Generated: " + res.toString());
    })
  }

  generateFlatFileASN(id, CustomerId){
    this.service.GenerateFlatFileASN(id, CustomerId).subscribe(res=>{
      alert("FlatFile ASN Generated: " + res.toString())
    })
  }

  shipOrder(id, CustomerId,)
  {
    if(window.confirm('Are you sure you want to SHIP Order ' + id +' ?'))
    {
      let ValidateRequiredFields = true;

      if (this.wid == 5087) //Handicraft
      {
        try
        {
          if (this.ExpectedArrivalDate.toString() == '1/1/1900' || 
              this.RequestedShipDate.toString() == '1/1/1900' ||
              !this.CarrierTrackingNumber || !this.CustomerPONumber)
          {
            ValidateRequiredFields = false;
            alert("Required fields for Handicraft are missing.");
          }
        }
        catch (Exception){
          ValidateRequiredFields = false;
          alert("Required fields for Handicraft are missing.");
        }
      }


      if (ValidateRequiredFields){
        //alert("Ready to ship");
        
        let val = {
          Id:id,
          CustomerId:CustomerId,
          ShipToCustomerId:this.ShipToCustomerId
        }
        this.service.shipOrder(val).subscribe(res=>{
          alert("Shipped Order: " + res.toString())
          this.Status = "SHIPPED";
        });
        
      }
    }
  }

  generateInvoice(){
    
  }

  addQuantityToPackage(dataItem, i){ 

    let QuantityToPack = this.PackingQuantity[dataItem.ID];
    let OrderItemId = dataItem.ID;
    let ItemId = dataItem.ItemId;
    let UnitOfMeasureId = dataItem.UnitOfMeasureId;
    let OrderedQuantity = dataItem.OrderedQuantity;
    let PackageId = this.PackageId;
    let QuantityAvailable = dataItem.QuantityAvailable;
    let LotNumber = dataItem.LotNumber;

    if (QuantityToPack > QuantityAvailable){
      alert("You are trying to pack more than available.");
      return;
    }

    let val = {
      PackageId:PackageId,
      OrderItemId:OrderItemId,
      ItemId:ItemId,
      UnitOfMeasureId:UnitOfMeasureId,
      QuantityToPack:QuantityToPack,
      OrderedQuantity:OrderedQuantity,
      LotNumber:LotNumber
    }

    this.service.packOrderItem(val).subscribe(res=>{
      //alert(res.toString())

      this.refreshPackages();
      this.refreshPackageItems()
      this.refreshOrderItemsUnpacked();
    });
  }

  autoPackPackage(dataItem, i){

    let AutoPackQuantity = this.AutoPackQuantity[dataItem.ID];

    let OrderItemId = dataItem.ID;
    let ItemId = dataItem.ItemId;
    let UnitOfMeasureId = dataItem.UnitOfMeasureId;
    let OrderedQuantity = dataItem.OrderedQuantity;
    let PackageId = this.PackageId;
    let LotNumber = dataItem.LotNumber;

    let AmountOfPackages = OrderedQuantity / AutoPackQuantity

    alert(AmountOfPackages + " packages are going to be created.");
    
    if (AutoPackQuantity > OrderedQuantity){
      alert("You are trying to pack more than available.");
      return;
    }

    let val = {
      PackageId:PackageId,
      OrderItemId:OrderItemId,
      ItemId:ItemId,
      UnitOfMeasureId:UnitOfMeasureId,
      QuantityToPack:AutoPackQuantity,
      OrderedQuantity:OrderedQuantity,
      LotNumber:LotNumber
    }

    for (let i=1; i<=AmountOfPackages; i++){
      this.service.packOrderItem(val).subscribe(res=>{
        //alert(res.toString())

        if (i==AmountOfPackages){
          this.refreshPackages();
          this.refreshPackageItems()
          this.refreshOrderItemsUnpacked(); 
        }
      });
    }

    this.refreshPackages();
    this.refreshPackageItems()
    this.refreshOrderItemsUnpacked(); 
  }

  refreshPackages(){
    this.service.getOrderPackages(this.id).subscribe(data=>{
      this.PackagesList=data;
    });
  }

  refreshOrderItemsUnpacked(){
    this.service.getOrderItemsUnpacked(this.id).subscribe(data=>{
      this.OrderItemsUnpackedList=data;
    })
  }

  updatePackageItems(item){
    this.PackageId = item.id;
    this.PackageGS1 = item.GS1;

    this.refreshPackageItems();
  }

  refreshPackageItems(){
    this.service.getOrderPackageItems(this.PackageId).subscribe(data=>{
      this.PackageContentsList=data;
    });
  }

  

  createPackage(content){
    this.modalService.open(content);

    this.Item={
      id:0,
      OrderId:this.id,
      CustomerGS1Prefix:this.ShipToGS1Prefix,
      PackagesToAutoCreate:this.OrderItemsUnpackedList.length - this.PackagesList.length,    
    }

    this.ModalTitle="Create Package";
    this.ActivateOrderPackageComp = true;
  }

  autoPackOrder()
  {
    let WeightCounter = 0;
    
    let OrderId = this.id;
    let GS1Prefix = localStorage.getItem('WarehouseGS1Prefix');
    let PackagesToAutoCreate = this.OrderItemsUnpackedList.length - this.PackagesList.length;
    
    var PackageTemplate = {
      OrderId:OrderId,
      GS1Prefix:GS1Prefix,
      AutoPacked:false,
      Package:"CASE",
    }

    //Create a Package for every OrderLineItem
    for (let i=0; i<PackagesToAutoCreate; i++){
      this.service.addOrderPackage(PackageTemplate, OrderId).subscribe(res=>{
        let PackageId = res.toString();
        //alert(res.toString())

        //Package contents packing variables
        let AutoPackQuantity = this.OrderItemsUnpackedList[i].RequestedPackQuantity;
        let OrderItemId = this.OrderItemsUnpackedList[i].ID;
        let ItemId = this.OrderItemsUnpackedList[i].ItemId;
        let UnitOfMeasureId = this.OrderItemsUnpackedList[i].UnitOfMeasureId;
        let OrderedQuantity = this.OrderItemsUnpackedList[i].OrderedQuantity;
        let LotNumber = this.OrderItemsUnpackedList[i].LotNumber;
        let Weight = this.OrderItemsUnpackedList[i].Weight;

        let AmountOfPackages = OrderedQuantity / AutoPackQuantity
        
        if (AutoPackQuantity > OrderedQuantity){
          alert("ERROR: You are trying to pack more than available.");
          return;
        }

        if (!AutoPackQuantity){
          alert("ERROR: The Requested Pack Quantity is not set on the Order Item. This value is automatically set on certain EDI Orders based on Client Data.");
          return;
        }

        let val = {
          PackageId:PackageId,
          OrderItemId:OrderItemId,
          ItemId:ItemId,
          UnitOfMeasureId:UnitOfMeasureId,
          QuantityToPack:AutoPackQuantity,
          OrderedQuantity:OrderedQuantity,
          LotNumber:LotNumber,
        }

        //Create a bundle for the req pack quantity
        for (let j=1; j<=AmountOfPackages; j++){
          WeightCounter += (Weight * AutoPackQuantity)
          this.service.packOrderItem(val).subscribe(res=>{
            //alert(res.toString())
            this.refreshPackageItems();

            //Only run this once at end
            if ((i+1) == PackagesToAutoCreate){
              //alert("Total Weight: "+ WeightCounter)
              //Run the Update Order Weight function
              let updateWeight = {
                id:OrderId,
                Weight:WeightCounter
              }
              this.service.updateOrderWeight(updateWeight).subscribe(res=>{
                //This should only run once but Valerie complained it runs twice
                //alert("Update Order Weight: " + res);

                this.refreshPackages();
                this.refreshOrderItemsUnpacked();
              })
            }
          });
        }

        
      });
    }
    
     
  }

  editPackage(content, item){
    this.modalService.open(content);

    this.Item=item;

    this.ModalTitle="Edit Package";
    this.ActivateOrderPackageComp = true;
  } 

  editPackageItem(content, item){
    this.modalService.open(content);

    this.Item=item;

    this.ModalTitle="Edit Package Item";
    this.ActivateOrderPackageItemComp = true;
  } 

  createPackageItem(content, item){
    this.modalService.open(content);

    this.Item={
      id:0,
      OrderId:this.id,
      PackageId:item.id,
      GS1:item.GS1,   
    }

    this.ModalTitle="Create Package Contents Item";
    this.ActivateOrderPackageItemComp = true;
  }

  editItem(content, item){
    this.modalService.open(content);

    this.Item={
      id:item.id,
      OrderedQuantity:item.OrderedQuantity,
      RequestedPackQuantity:item.RequestedPackQuantity,
      Status:item.Status
    }

    this.ModalTitle="Update Quantity";
    this.ActivateEditItemComp = true;
  }

  deletePackage(dataItem){
    if (dataItem.QuantityInPackage > 0){
      alert("You must Unpack the " + dataItem.QuantityInPackage + " items in this package first.");
    }
    else{
      if(window.confirm('Are you sure you want to delete this package' + dataItem.id +' ?')){
        this.service.deleteOrderPackage(dataItem.id).subscribe(res=>{
          //alert(res.toString())
          this.refreshPackages();

          this.PackageId = 0;
        });  
      }
    }
  }

  deletePackageItem(dataItem){
    let PackageItemId = dataItem.id;
    let OrderItemId = dataItem.OrderItemId;
    let Quantity = dataItem.Quantity;

    if(window.confirm('Are you sure you want to delete this package item ' + PackageItemId +' ?')){
      let val = {
        id:PackageItemId,
        OrderItemId:OrderItemId,
        QuantityToPack:Quantity,
      }

      this.service.deleteOrderPackageItem(val).subscribe(res=>{
        //alert(res.toString())
        this.refreshPackages();
        this.refreshPackageItems();
        this.refreshOrderItemsUnpacked();
      });  
    }
  }

  pickAll(){
    if (window.confirm("Are you sure you want to Pick All line items for Order" + this.id)){
      this.OrderItemsList.forEach( (i) => {
        this.finishPicking(i, false);
        //this.refreshOrderItems();
      });
      this.refreshOrderItems();
    }
  }

  transferOrder(content){
    this.modalService.open(content);

    this.Item={
      OrderId:this.id, 
    }

    this.ModalTitle="Transfer Order "+this.id+" to Warehouse";
    this.ActivateTransferOrderWarehouseComp = true;
  }

  refreshServicesList(){
    this.service.getServicesList().subscribe(data=>{
      this.ServicesList=data;
    });
  }
  
  updateService(item){
    this.ShippingServiceId = item.id;
    this.ShippingServiceName = item.ServiceName;
  }

  downloadPackingSlip(id){
    //window.open(environment.ReportServer + "/Pages/ReportViewer.aspx?%2fWMS%2fPackingSlip&rs:Command=Render&rs:Format=PDF&OrderId="+id, "_blank");
    window.open(environment.ReportServer + "/ReportServer.aspx?%2fWMS%2fPackingSlip&rs:Command=Render&rs:Format=PDF&OrderId="+id, "_blank");
  }

  downloadPickSheet(id){
    //window.open(environment.ReportServer + "/Pages/ReportViewer.aspx?%2fWMS%2fPickingSheet&rs:Command=Render&rs:Format=PDF&OrderId="+id, "_blank");
    window.open(environment.ReportServer + "/ReportServer.aspx?%2fWMS%2fPickingSheet&rs:Command=Render&rs:Format=PDF&OrderId="+id, "_blank");
  }

  generateGS1Labels(){
    let val = {OrderId:this.id, WarehouseId:this.wid}

    this.service.generateGS1Labels(val).subscribe(res=>{
      alert(res.toString());

      this.refreshPackageItems();
    })
  }

  UnAllocateOrderItem(OrderItemId){
    this.service.UnAllocateOrderItem(OrderItemId).subscribe(res=>{
      alert(res.toString());
      this.refreshOrderItems();
    })
  }

  UnAllocateAll(){
    if (window.confirm("UnAllocate every item")){
      this.OrderItemsList.forEach( (i) =>
      {
        if(i.QuantityAllocated > 0){
          let OrderItemId = i.id;
          this.UnAllocateOrderItem(OrderItemId);
        }
      })
    }
  }

  flagForTomyBatch(OrderId){
    if (this.Status == 'SHIPPED')
    {
      this.service.FlagForTomyBatch(OrderId).subscribe(res=>{
        alert(res.toString());
      })
    }
    else {
      alert("Order must be Shipped before Sending ASN");
    }
  }

  UnpackOrder(OrderId){
    this.service.UnpackOrder(OrderId).subscribe(res=>{
      alert(res.toString());
      this.refreshPackages();
      this.refreshOrderItemsUnpacked();
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.MasterInventoryList.filter(option => option.SKU.toLowerCase().includes(filterValue));
  }

}

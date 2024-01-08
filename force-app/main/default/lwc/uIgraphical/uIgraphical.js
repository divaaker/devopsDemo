/*
This JavaScript file defines a Lightning Web Component (LWC) named graphQlExample. The component uses the @wire decorator to call a GraphQL query and retrieve data from multiple objects in Salesforce. The retrieved data is then displayed in the component's template.

The graphQlExample component has three properties: Accounts, lead, and beer. These properties are used to store the retrieved data from the GraphQL query. The renderData property is used to control the rendering of the component's template.

The component has three getter methods: columnsLead, columnsBeer, and getmultipleObjectQuery. The columnsLead and columnsBeer methods return an array of objects that define the columns to be displayed in the component's template for the Lead and Beer__c objects, respectively.

The getmultipleObjectQuery method is decorated with the @wire decorator and calls a GraphQL query
*/
import { LightningElement, wire, track, api } from 'lwc';
import { gql, graphql } from 'lightning/uiGraphQLApi';

export default class GraphQlExample extends LightningElement {
    errors;
    renderData = false;
    contact;
    searchName='';
    searchKey='';
    records = [];
    recordsCount;
    errors;
    pageInfo;
    hasNextPage;
    hasPreviousPage;
    startCursor;
    lastStartCursor =[];
    currentPage=0;
    @track friendCursor;
    @track isLoading =false;
    @track recordsEmpty =false;
    @track recordsFound =false;
    showDebugValues = false ;t

    get columnsContact() {
        return [
            { label: 'Volunteer ID', fieldName: 'id' },
            { label: 'Volunteer Name', fieldName: 'name' },
            { label: 'Volunteer Email', fieldName: 'email' },
            { label: 'Volunteer Organization', fieldName: 'organization' },
            { label: 'Volunteer Phone', fieldName: 'phone' },
            { label: 'Volunteer Status', fieldName: 'status' },
            { label: 'Date Of Birth', fieldName: 'birthdate' },
            {
                type: "button", label: 'View', initialWidth: 100, typeAttributes: {
                    label: 'View',
                    name: 'View',
                    title: 'View',
                    disabled: false,
                    value: 'view',
                    iconPosition: 'left',
                    iconName:'utility:preview',
                    variant:'Brand',
                }
            },
            {
                type: "button", label: 'Edit', initialWidth: 100, typeAttributes: {
                    label: 'Edit',
                    name: 'Edit',
                    title: 'Edit',
                    disabled: false,
                    value: 'edit',
                    iconPosition: 'left',
                    iconName:'utility:edit',
                    variant:'Brand',
                }
            },
            {
                type: "button", label: 'Delete', initialWidth: 110, typeAttributes: {
                    label: 'Delete',
                    name: 'Delete',
                    title: 'Delete',
                    disabled: false,
                    value: 'delete',
                    iconPosition: 'left',
                    iconName:'utility:delete',
                    variant:'destructive',
                }
            }
        ];
    }


    @wire(graphql, {
        query: gql`
            query multipleObjectQuery(
                $searchKey : String,
                $friendCursor: String
            ) {
                uiapi {
                    query {
                        Contact (
                            first: 20,
                            after:$friendCursor, 
                            where: {
                                or: [
                                    { Name: { like : $searchKey } },
                                    { AssistantName: { like : $searchKey } }
                                ]                               
                            }     
                        ){
                            totalCount
                            edges {
                                node {
                                    Id
                                    Name {
                                        value
                                    }
                                    Email {
                                        value
                                    }
                                    Account {
                                        Id
                                        Name{
                                          value
                                        }                                        
                                    }
                                    Phone {
                                        value
                                    }
                                    CleanStatus {
                                        value
                                    }
                                    Birthdate  {
                                        value
                                    }
                                }
                                cursor
                            }
                            pageInfo {
                                endCursor
                                hasNextPage
                                hasPreviousPage
                                startCursor
                              }
                        }
                    }
                }
            }
        `,
        variables: "$variables",
    })

    getmultipleObjectQuery({ data, errors }) {
        if (data) {
            this.contact = data.uiapi.query.Contact.edges.map(
                (contact) => {
                    return {
                        id: contact.node.Id,
                        name: contact.node.Name.value,
                        email: contact.node.Email.value,
                        organization: contact.node.Account.Name.value,
                        phone: contact.node.Phone.value,
                        status: contact.node.CleanStatus.value,
                        birthdate: contact.node.Birthdate.value,
                    };
                }
            );
            this.renderData = true;
            console.log('this.contact', JSON.stringify(this.contact));
            this.errors = undefined;

            this.recordsCount = data.uiapi.query.Contact.totalCount;
            this.hasNextPage = data.uiapi.query.Contact.pageInfo.hasNextPage
            this.endCursor = data.uiapi.query.Contact.pageInfo.endCursor
            this.startCursor = data.uiapi.query.Contact.pageInfo.startCursor
            this.hasPreviousPage = data.uiapi.query.Contact.pageInfo.hasPreviousPage
            //add startCursor to reverse Pagination
            if(!this.lastStartCursor.find(element => element==this.startCursor) && this.startCursor!==null){
                this.lastStartCursor.push(this.startCursor);
            }
            if(!this.hasPreviousPage){
                this.currentPage=0
            }
        }
        if (errors) {
            this.errors = errors;
            this.renderData=false;
        }   
    }

    callRowAction(event) {
        //alert('Test');
        const recId = event.detail.row.Id;
        const row = event.detail.row;
        const actionName = event.detail.action.name;
        console.log('actionName==='+actionName);
        console.log('recId==='+recId);
        console.log('row==='+row.id);
        if (actionName === 'Edit') {
          //alert('Test1');
            //this.handleAction(recId, 'edit');
        } else if (actionName === 'Delete') {
          //alert('Test2');
            //this.handleDeleteRow(recId);
        } else if (actionName === 'View') {
            this.handleAction(row.id, 'view');
           // alert('Test3');
        }
    }

    handleclick(){
        var el = this.template.querySelector('lightning-datatable');
        console.log(el);
        var selected = el.getSelectedRows();
        console.log(selected);
    }

    handleAction(recordId, mode) {
        window.open('https://girikonllc2-dev-ed.lightning.force.com/lightning/r/Contact/'+recordId+'/view?0.source=alohaHeader', '_blank');
    }
    handleDeleteRow(recordIdToDelete) {
        deleteRecord(recordIdToDelete)
            .then(result => {
                this.showToast('Success!!', 'Record deleted successfully!!', 'success', 'dismissable');
                return refreshApex(this.wireResult);
            }).catch(error => {
                this.error = error;
            });
    }
    showToast(title, message, variant, mode) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
    }

    get variables() {
        return {
            searchKey: '%' + this.searchKey + '%',  
            friendCursor: this.friendCursor
        };
      }

    handleInputChange(event) {
        this.searchKey = event.detail.value;
        console.log(this.searchKey);
    }

    handleMoveNext = (event)=>{
        this.isLoading = true;
        this.currentPage +=1;
        this.friendCursor = this.endCursor;
        this.isLoading = false;
    }
    handleMovePrev = (event)=>{
        this.isLoading = true;
        let targetPage = this.currentPage -1;
        this.friendCursor = this.lastStartCursor[targetPage];
        this.currentPage -=1;
        this.isLoading = false;
    }
    get showMovePrevious(){
        return !this.hasPreviousPage && !this.isLoading;
    }
    get showMoveNext(){
        return !this.hasNextPage && !this.isLoading;
    }
}
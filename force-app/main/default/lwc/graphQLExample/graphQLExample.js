/*
This JavaScript file defines a Lightning Web Component (LWC) named graphQlExample. The component uses the @wire decorator to call a GraphQL query and retrieve data from multiple objects in Salesforce. The retrieved data is then displayed in the component's template.

The graphQlExample component has three properties: Accounts, lead, and beer. These properties are used to store the retrieved data from the GraphQL query. The renderData property is used to control the rendering of the component's template.

The component has three getter methods: columnsLead, columnsBeer, and getmultipleObjectQuery. The columnsLead and columnsBeer methods return an array of objects that define the columns to be displayed in the component's template for the Lead and Beer__c objects, respectively.

The getmultipleObjectQuery method is decorated with the @wire decorator and calls a GraphQL query
*/
import { LightningElement, wire } from 'lwc';
import { gql, graphql } from 'lightning/uiGraphQLApi';

export default class GraphQlExample extends LightningElement {
    errors;
    renderData = false;
    Accounts;
    lead;
    beer;

    get columns() {
        return [
            { label: 'Account ID', fieldName: 'id' },
            { label: 'Account Name', fieldName: 'name' },
            { label: 'Contacts Name', fieldName: 'contactName' },
            { label: 'Opportunities Name', fieldName: 'oppName' },
            { label: 'Case numbers', fieldName: 'caseNum' }
        ];
    }

    get Accdata() {
        return this.Accounts.map((account) => {
            return {
                id: account.id,
                name: account.name,
                contactName: account.contacts.map((contact) => {
                    return contact.name;
                }).join(', '),
                oppName: account.opportunities.map((opportunity) => {
                    return opportunity.name;
                }).join(', '),
                caseNum: account.cases.map((casedetail) => {
                    return casedetail.caseNumber;
                }).join(', ')
                

            };
        });
    }

    get columnsLead() {
        return [
            { label: 'Lead ID', fieldName: 'id' },
            { label: 'Lead Name', fieldName: 'name' },
        ];
    }

    get columnsAccount() {
        return [
            { label: 'Account ID', fieldName: 'id' },
            { label: 'Account Name', fieldName: 'name' },
        ];
    }


    @wire(graphql, {
        query: gql`
            query multipleObjectQuery {
                uiapi {
                    query {
                        Account {
                            edges {
                                node {
                                    Id
                                    Name {
                                        value
                                    }
                                    Contacts {
                                        edges {
                                            node {
                                                Id
                                                Name {
                                                    value
                                                }
                                            }
                                        }
                                    }
                                    Opportunities {
                                        edges {
                                            node {
                                                Id
                                                Name {
                                                    value
                                                }
                                            }
                                        }
                                    }
                                    Cases {
                                        edges {
                                            node {
                                                Id
                                                CaseNumber {
                                                    value
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        Lead {
                            edges {
                                node {
                                    Id
                                    Name {
                                        value
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `
    })
    getmultipleObjectQuery({ data, errors }) {
        if (data) {
            this.Accounts = data.uiapi.query.Account.edges.map(
                (account) => {
                    return {
                        id: account.node.Id,
                        name: account.node.Name.value,
                        contacts: account.node.Contacts.edges.map((contact) => {
                            return {
                                id: contact.node.Id,
                                name: contact.node.Name.value
                            };
                        }),
                        opportunities: account.node.Opportunities.edges.map((Opportunity) => {
                            return {
                                id: Opportunity.node.Id,
                                name: Opportunity.node.Name.value
                            };
                        }),
                        cases: account.node.Cases.edges.map((casedetail) => {
                            return {
                                id: casedetail.node.Id,
                                caseNumber: casedetail.node.CaseNumber.value
                            };
                        })
                    };
                }
            );
            
            this.lead = data.uiapi.query.Lead.edges.map(
                (lead) => {
                    return {
                        id: lead.node.Id,
                        name: lead.node.Name.value,
                    };
                }
            );
            this.renderData = true;

            console.log('this.Accounts', JSON.stringify(this.Accounts));
            console.log('this.lead', JSON.stringify(this.lead));

            this.errors = undefined;
        }
        if (errors) {
            this.Accounts = undefined;
            this.errors = errors;
            this.renderData=false;
        }
    }
}
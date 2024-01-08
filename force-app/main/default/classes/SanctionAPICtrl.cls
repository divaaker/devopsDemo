public with sharing class SanctionAPICtrl {
    public static HttpResponse getResponse() {
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        //req.setEndpoint('https://api.sanctions.io/search/?data_source=SDN&name=Divaker%20Singh');
        req.setEndpoint('callout:Test'+'/search/?data_source=SDN&name=Divaker%20Singh');
        req.setMethod('GET');
        req.setHeader('Accept', 'application/json; version=2.2');
        req.setHeader('Authorization','{!$Credential.sanctionAPI.Token}');
        //req.setHeader( 'Authorization', 'Bearer 7dee3436-d02c-4c4f-9de3-1f79bd85101f');
        System.debug(req);
        HttpResponse res = http.send(req);

        // Log the JSOn content
        System.debug(res.getBody());
        return res;
    }
}
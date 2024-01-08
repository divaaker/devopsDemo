/**
* @description : 
* @author : Shiv Shanakr
* @group : 
* @last modified on : 02-07-2023
* @last modified by : Shiv Shankar
**/
public with sharing class ChatGPTController {
       Public string key = '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';
       private static final String ENDPOINT ='https://api.openai.com/v1/completions';
                @AuraEnabled
                public static String getSearchData(String searchString){
                         try{
                              string key = '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';
                              String seachQueryEscaped = (searchString).trim();
                              Http http = new Http();
                              String reqBody = '{"model": "text-davinci-003","prompt":"'
                             +seachQueryEscaped+
                             '","max_tokens": 4000,"temperature": 0,'
                             +'"stream": false,"top_p": 0.5}';
                           // System.debug('Query '+seachQueryEscaped+' '+reqBody);
                             HttpRequest request = new HttpRequest();
                             request.setEndpoint(ENDPOINT);
                             request.setBody(reqBody);
                             request.setMethod('POST');
                             request.setHeader('Authorization', 'Bearer '+String.escapeSingleQuotes(key).trim());
                             request.setTimeout(120000);
                             request.setHeader('Content-Type', 'application/json;charset=UTF-8');
                             HttpResponse response = http.send(request);
                             if(response.getStatusCode() != 200) {
                             System.debug('The status code returned was not expected: ' + response.getStatusCode() + ' ' +
                             response.getBody());
                             return response.getBody();
                             }
                             return response.getBody();
                        }catch(Exception ex){
                             System.debug('Exception in Catch of Server-Side Controller '+ex);
                             throw new AuraHandledException(ex.getMessage());
                        }
            }
}
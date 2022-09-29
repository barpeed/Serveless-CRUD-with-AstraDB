const { createClient } = require("@astrajs/collections");


export const handler = async (event: any = {}): Promise<any> => {
    
    let method = "";
    let search = "all";
    let field = "";
    let colletion = "";

    if (event.queryStringParameters && event.queryStringParameters.httpMethod) {
        console.log("method: " + event.queryStringParameters.httpMethod);
        method = event.queryStringParameters.httpMethod;
    }
   
    if (event.queryStringParameters && event.queryStringParameters.field) {
        console.log("Received field: " + event.queryStringParameters.field);
        field = event.queryStringParameters.field;
    }

    if (event.queryStringParameters && event.queryStringParameters.search) {
        console.log("Received search: " + event.queryStringParameters.search);
        search = event.queryStringParameters.search;
    }
    
    if (event.queryStringParameters && event.queryStringParameters.collection) {
        console.log("Collection: " + event.queryStringParameters.collection);
        colletion = event.queryStringParameters.collection;
    }

    const astraClient = await createClient(
            {
            astraDatabaseId: process.env.ASTRA_DB_ID,
            astraDatabaseRegion: process.env.ASTRA_DB_REGION,
            applicationToken: process.env.ASTRA_DB_APPLICATION_TOKEN,
            },
        );

    const astradbClient = astraClient.namespace(process.env.ASTRA_DB_KEYSPACE).collection(colletion);

    if(method == "GET"){


            if(search=="all"){
                try {
                    const res = await astradbClient.find({});

                    const formattedPromotions = Object.keys(res).map((item) => res[item]);
                
                    return {
                    statusCode: 200,
                    body: JSON.stringify(formattedPromotions),
                    };
                } catch (e) {
                    return {
                    statusCode: 400,
                    body: JSON.stringify(e),
                    };
                }
            }else{
                try {
                    
                    const todoResult = await astradbClient.get(search);

                    const todo = Object.keys(todoResult).map((item) => todoResult[item]);
                
                    return {
                    statusCode: 200,
                    body: JSON.stringify(todo),
                    };
                } catch (e) {
                    console.log(e)
                    return {
                    statusCode: 400,
                    body: JSON.stringify(e),
                    };
                }
            }
        
        }



    if(method == "POST"){

        console.log(event.body)

        const body = JSON.parse(event.body);

        try {

            const email = body?.email;
            
            delete body.email;

            console.log(JSON.stringify(body))

            const result = await astradbClient.create(email,body);
           
            console.log("documentID:" + result.documentId);
            
            return {
                statusCode: 200,
                body: result.documentId,
            };
        } catch (e) {
            console.log(e)
            return {
                statusCode: 400,
                body: JSON.stringify(e),
            };
        }
    }

    if(method == "PUT"){

        console.log(event.body)

        const body = JSON.parse(event.body);

        try {

            const email = body?.email;

            const result = await astradbClient.update(email, body);
           

            return {
                statusCode: 200,
                body: JSON.stringify(result.documentId),
            };
        } catch (e) {
                console.log(e)
                return {
                    statusCode: 400,
                    body: JSON.stringify(e),
                };
        }
    }

}



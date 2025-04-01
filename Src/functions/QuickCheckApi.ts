/**
 * @module QuickCheckApi
 * Azure Function that provides an HTTP endpoint for quickly checking if a given statement
 * looks like a system requirement. 
 */
// Copyright (c) 2025 Jon Verrier

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { quickCheckLooksLikeRequirement, IQuickCheckRequest, IQuickCheckResponse } from "../QuickCheck";

export async function quickCheckApi(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   context.log(`Http function processed request for url "${request.url}"`);

   try {
      let statement = '';
      let beFriendly = true;

      if (request.method === 'GET') {
         statement = request.query.get('statement') || '';
         beFriendly = request.query.get('beFriendly')?.toLowerCase() === 'false' ? false : true;
      } else {
         const body = await request.json() as IQuickCheckRequest;
         context.log(`Request: ${JSON.stringify(body)}`);
         statement = body.statement || '';
         beFriendly = body.beFriendly ?? true;
      }

      const response: IQuickCheckResponse = await quickCheckLooksLikeRequirement({ statement, beFriendly });

      context.log(`Result: ${JSON.stringify(response)}`);

      return { body: JSON.stringify(response) };
   }
   catch (error) {
      context.error(`Error: ${error}`);
      return { status: 500, body: `Error: ${error}` };
   }
};

app.http('QuickCheck', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: quickCheckApi
});

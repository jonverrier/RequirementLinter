/**
 * @module quickcheck
 * Azure Function that provides an HTTP endpoint for quickly checking if a given statement
 * looks like a system requirement. 
 */
// Copyright (c) 2025 Jon Verrier

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { quickCheckLooksLikeRequirement, IQuickCheckRequest, IQuickCheckResponse } from "../QuickCheck";

export async function quickcheck(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   context.log(`Http function processed request for url "${request.url}"`);

   try {
      const body = await request.json() as IQuickCheckRequest;
      context.log(`Request: ${JSON.stringify(body)}`);

      const statement = body.statement || '';
      const beFriendly = body.beFriendly || true;

      const response: IQuickCheckResponse = await quickCheckLooksLikeRequirement({ statement, beFriendly });

      context.log(`Result: ${JSON.stringify(response)}`);

      return { body: JSON.stringify(response) };
   }
   catch (error) {
      context.error(`Error: ${error}`);
      return { status: 500, body: `Error: ${error}` };
   }
};

app.http('quickcheck', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: quickcheck
});

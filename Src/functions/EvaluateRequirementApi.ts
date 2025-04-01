/**
 * @module EvaluateRequirementApi
 * Azure Function that provides an HTTP endpoint for evaluating a given requirement. 
 */
// Copyright (c) 2025 Jon Verrier

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { evaluateRequirement, IRequirementEvaluation, IRequirementEvaluationRequest } from "../EvaluateRequirement";

export async function evaluateRequirementApi(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   context.log(`Http function processed request for url "${request.url}"`);

   try {
      let requirement = '';
      
      if (request.method === 'GET') {
         requirement = request.query.get('requirement') || '';
      } else {
         const body = await request.json() as IRequirementEvaluationRequest;
         context.log(`Request: ${JSON.stringify(body)}`);
         requirement = body.requirement || '';
      }

      const response: IRequirementEvaluation = await evaluateRequirement({ requirement });

      context.log(`Result: ${JSON.stringify(response)}`);

      return { body: JSON.stringify(response) };
   }
   catch (error) {
      context.error(`Error: ${error}`);
      return { status: 500, body: `Error: ${error}` };
   }
};

app.http('EvaluateRequirement', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: evaluateRequirementApi
});

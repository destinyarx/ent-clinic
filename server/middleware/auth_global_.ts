import jwt from "jsonwebtoken";

export default defineEventHandler((event) => {

    // const authHeader = getHeader(event, "Authorization");
    // const token = authHeader.split(" ")[1]; 


    // const user_jwt =  "eyJhbGciOiJIUzI1NiIsImtpZCI6ImkwQjZSU0ZwU2hQR1dQV2kiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2dneW9na2liZWJpanl5am5pc2JhLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI0ZjQxOGEzMS1jMWJlLTQwMWItYjdhOC0wMTVkMzlmMmJkNmYiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzMyMDM2OTUwLCJpYXQiOjE3MzIwMzMzNTAsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7fSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTczMjAzMzM1MH1dLCJzZXNzaW9uX2lkIjoiOWI1NDYzYmQtOTc5Ny00Y2IxLTlhMjEtODg2NTkyNmRkYWY1IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.shRCdPVS-isMraxy-CsHCKV8GmwWrVKE_xmldyDOSPA";

    // try {
    //     const check = jwt.verify(user_jwt, process.env.SUPABASE_JWT);

    // } catch(error) {
    //     return { 
    //         valid: true,
    //         message: 'Valid Token',
    //         error: error
    //     };
    // }

    
})

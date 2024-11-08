// import { supabase } from '@/utils/supabaseClient';


// export default defineEventHandler(async (event) => {
//     // const authHeader = event.node.req.headers['authorization'];
//     // const token = authHeader?.split(' ')[1];

//     // if (!token) {
//     //     // Return a 401 Unauthorized response if no token is provided
//     //     return { statusCode: 401, body: { error: 'Unauthorized' } };
//     // }

//     // // Verify the token with Supabase
//     // const { user, error } = await supabase.auth.api.getUser(token);

//     // if (error || !user) {
//     //     // Return a 401 if the token is invalid
//     //     return { statusCode: 401, body: { error: 'Unauthorized' } };
//     // }

//     // If authenticated, proceed with the endpoint logic
//     // return { message: 'Protected content accessible!' };
// });
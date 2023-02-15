import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';
// import type { Database } from 'types_db'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // const supabaseServerClient = createServerSupabaseClient({
    //     req,
    //     res,
    // });
    // const {
    //     data: { user },
    // } = await supabaseServerClient.auth.getUser();

    // if (req.method === 'POST') {

    //     try {
    //         const { data, error } = await supabaseServerClient.auth.signInWithOAuth({
    //             provider: 'discord',
    //             options:
    //             {
    //                 scopes: 'connections email identify guilds guilds.members.read',
    //                 redirectTo: 'localhost:3000/'
    //             }
    //         });
    //         console.log(data);

    //         const { data: { session } } = await supabaseServerClient.auth.getSession();

    //         console.log(session);

    //         return res.status(200).json('ok');

    //     } catch (err) {
    //         console.log(err);
    //     }
    // }
};
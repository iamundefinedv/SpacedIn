import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';
// import type { Database } from 'types_db'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const supabaseServerClient = createServerSupabaseClient({
        req,
        res,
    });
    const {
        data: { user },
    } = await supabaseServerClient.auth.getUser();

    // res.status(200).json({ name: user?.user_metadata. ?? '' });
};
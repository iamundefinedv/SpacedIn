import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
    organization_name: string,
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    if (req.method !== 'POST') return;

}

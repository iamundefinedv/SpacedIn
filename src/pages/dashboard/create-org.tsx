import DashboardSideNav from '@/components/DashboardSideNav';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { use, useState } from 'react';

const discordApiUrl = 'https://discord.com/api/v10';

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const supabase = createServerSupabaseClient(context);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const { data, error } = await supabase.from('organizations').select().eq('owner_id', session.user.id);

    if (error || data.length > 0) {
        return {
            redirect: {
                destination: '/dashboard/profile',
                permanent: false,
            }
        };
    }

    return {
        props: {

        }
    };
}

export default function CreateOrg() {

    const supabase = useSupabaseClient();
    const user = useUser();

    const router = useRouter();

    const [name, setName] = useState<string>();
    const [biography, setBiography] = useState<string>();
    const [location, setLocation] = useState<string>();
    const [logoUrl, setLogoUrl] = useState<string>();


    const handleCreateOrg = async () => {


        if (!name || !biography || !location) {
            router.push('/');
        }
        else {
            try {
                const { data, error } = await supabase.from('organizations').insert({
                    owner_id: user?.id,
                    name, biography, location
                });

                if (error) throw error;

                router.push('/');
            } catch (err) {
                console.log(err);
            }
        }


    };


    return (
        <>
            <Navbar dashboard={true} />
            <div id="layoutSidenav">
                <DashboardSideNav profile={true} createOrg={true} />
                <div id="layoutSidenav_content">
                    <section id="create-org">
                        <div className="container pb-5">
                            <div className="row">
                                <div className="col-md-10 offset-md-1">
                                    <h1 className='text-center mb-3'>Create Your Organization</h1>
                                    <span>
                                        <div className="form-group">
                                            <label htmlFor="exampleFormControlInput1">Organization Name</label>
                                            <input value={name} onChange={e => setName(e.target.value)} type="text" className="form-control mt-2" id="exampleFormControlInput1" placeholder="My org..." />
                                        </div>
                                        <div className="form-group mt-3">
                                            <label htmlFor="exampleFormControlInput1">Location</label>
                                            <select value={location} onChange={e => setLocation(e.target.value)} className="form-select" aria-label="choosel location">
                                                <option value="NA">North America</option>
                                                <option value="SA">South America</option>
                                                <option value="EU">Europe</option>
                                                <option value="OCE">Oceania</option>
                                                <option value="APAC">Asia-Pacific</option>
                                            </select>
                                        </div>
                                        {/* <div className="form-group mt-3">
                                            <label htmlFor="exampleFormControlInput1">Discord Server (used for roles and  your logo)</label>
                                            <select placeholder='Please link your organizations discord server' className="form-select" aria-label="choosel location">
                                                <option value="1">Server One</option>
                                                <option value="3">Server Two</option>
                                            </select>
                                        </div> */}
                                        <div className="form-group mt-3">
                                            <label htmlFor="exampleFormControlTextarea1">Logo</label>
                                            <input type='file' onChange={e => setLogoUrl(e.target.value)} className="form-control mt-2" id="exampleFormControlTextarea1" placeholder='My Org is...' />
                                        </div>
                                        <div className="form-group mt-3">
                                            <label htmlFor="exampleFormControlTextarea1">Biography</label>
                                            <textarea value={biography} onChange={e => setBiography(e.target.value)} className="form-control mt-2" id="exampleFormControlTextarea1" placeholder='My Org is...' rows={10}></textarea>
                                        </div>
                                        <div className="form-group mt-3">
                                            <button onClick={handleCreateOrg} className="btn btn-primary form-control">Create</button>
                                        </div>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
}

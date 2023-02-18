import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {GetServerSidePropsContext} from "next";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import JobPostingCard from "@/components/cards/JobPostingCard";

export async function getServerSideProps(context: GetServerSidePropsContext) {

    const supabase = createServerSupabaseClient(context);

    const {data: {session}} = await supabase.auth.getSession();
    try {

        const postings = await supabase.from("postings").select("title, slug, profiles(username)");

        if (postings.error) {
            console.log(postings.error);
            return {
                props: {}
            };
        }

        console.log(postings.data);


        return {
            props: {postings}
        };
    } catch (err) {
        console.log(err);
        return {
            redirect: {
                destination: "/",
            }
        };
    }
}

interface PostingProps {
    data: PostingPropsData[];
}

interface PostingPropsData {
    title: string,
    slug: string,
}


export default function Jobs({postings}: { postings: PostingProps }) {
    return (
        <>
            <Navbar dashboard={false}/>

            <div className="container mt-5">
                <div className="row">
                    {postings.data.map(posting => (<>
                        <div className="col-md-7">
                            <JobPostingCard posting={posting}/>
                        </div>
                    </>))}
                </div>
            </div>

            <Footer/>
        </>
    );
}

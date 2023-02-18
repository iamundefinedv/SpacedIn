import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {GetServerSidePropsContext} from "next";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import JobPostingCard from "@/components/cards/JobPostingCard";

export async function getServerSideProps(context: GetServerSidePropsContext) {

    const supabase = createServerSupabaseClient(context);

    const {data: {session}} = await supabase.auth.getSession();
    try {

        const {data, error} = await supabase.from("postings").select("title, slug");

        if (error) {
            console.log(error);
            return {
                props: {}
            };
        }

        return {
            props: {data}
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
    title: string,
    slug: string,
}


export default function JobPosting({data}: { data: PostingProps[] }) {
    return (
        <>
            <Navbar dashboard={false}/>

            <div className="container">
                <div className="row">
                    {data.map(posting => (<>
                        <div className="col-md-8">
                            <JobPostingCard posting={posting}/>
                        </div>
                    </>))}
                </div>
            </div>

            <Footer/>
        </>
    );
}

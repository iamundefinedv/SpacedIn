import Link from "next/link";

interface PostingProps {
    title: string,
    slug: string,
}

export default function JobPostingCard({posting}: { posting: PostingProps }) {
    return (
        <>
            <div className="card mb-3 pb-4 shadow-sm">
                <div className="row g-0">
                    <div className="col-3 col-md-2 pt-4 ps-4">
                        <img src="/img/scopedin.png" className="img-fluid rounded-start card-image" alt="..."/>
                    </div>
                    <div className="col-9 col-md-10 pt-4">
                        <h5 className="card-title pb-2 ps-1">
                            <Link className="text-decoration-none text-white" href={`/jobs/${posting.slug}`}>
                                {posting.title}
                            </Link>
                        </h5>
                        <div className="row">
                            <div className="col-6">
                                <h6 className="text-muted ps-1"><i className="bi bi-building pe-1"></i>LionheartGG</h6>
                            </div>
                            <div className="col-6">
                                <h6 className="text-muted"><i className="bi bi-globe-americas pe-1"></i> North America
                                </h6>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <h6 className="text-muted ps-1"><i className="bi bi-calendar-week pe-1"></i>Part Time
                                </h6>
                            </div>
                            <div className="col-6">
                                <h6 className="text-muted"><i className="bi bi-bank pe-1"></i>Unpaid</h6>
                            </div>
                        </div>
                        <p className="card-text pt-1 ps-1"><small className="text-muted">Last updated 3 mins ago</small>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
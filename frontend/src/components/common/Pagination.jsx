const Pagination = ({
    currentPage,
    totalPages,
    totalRecords,
    onPageChange,
}) => {

    if (totalPages <= 1) {

        return (

            <div className="text-slate-400">

                {totalRecords} Records

            </div>

        );

    }

    const pages = [];

    for (let i = 1; i <= totalPages; i++) {

        pages.push(i);

    }

    return (

        <div className="flex items-center gap-2 flex-wrap">

            <span className="text-slate-400 mr-3">

                {totalRecords} Records

            </span>

            <button

                disabled={currentPage === 1}

                onClick={() =>
                    onPageChange(currentPage - 1)
                }

                className={`px-3 py-2 rounded-lg ${
                    currentPage === 1
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                        : "bg-slate-700 hover:bg-slate-600"
                }`}

            >

                Previous

            </button>

            {

                pages.map((page) => (

                    <button

                        key={page}

                        onClick={() =>
                            onPageChange(page)
                        }

                        className={`px-4 py-2 rounded-lg transition ${
                            currentPage === page
                                ? "bg-blue-600"
                                : "bg-slate-800 hover:bg-slate-700"
                        }`}

                    >

                        {page}

                    </button>

                ))

            }

            <button

                disabled={currentPage === totalPages}

                onClick={() =>
                    onPageChange(currentPage + 1)
                }

                className={`px-3 py-2 rounded-lg ${
                    currentPage === totalPages
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                        : "bg-slate-700 hover:bg-slate-600"
                }`}

            >

                Next

            </button>

        </div>

    );

};

export default Pagination;
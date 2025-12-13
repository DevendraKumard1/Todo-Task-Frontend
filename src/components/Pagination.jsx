function Pagination({ limit, currentPage, setCurrentPage, total, setOffset }) {
    const totalPages = Math.ceil(total / limit);
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
    }

    const goToPage = (page) => {
        setCurrentPage(page);
        setOffset((page - 1) * limit);
    };

    const handleNext = () => {
    if (currentPage < totalPages) {
        goToPage(currentPage + 1);
    }
    };

    const handlePrevious = () => {
    if (currentPage > 1) {
        goToPage(currentPage - 1);
    }
    };

    const handlePageClick = (page) => {
        goToPage(page);
    };
    return (
        <>
        <div className="card-footer d-flex justify-content-between">
          <span>Page {currentPage} of {totalPages || 1}</span>
          <div>
            <button
              className="btn btn-secondary btn-sm mr-2"
              disabled={currentPage === 1}
              onClick={handlePrevious}
            >
              Previous
            </button>

            {pages.map(num => (
              <button
                key={num}
                className={`btn btn-sm mx-1 ${
                  num === currentPage ? "btn-primary" : "btn-secondary"
                }`}
                onClick={() => handlePageClick(num)}
              >
                {num}
              </button>
            ))}

            <button
              className="btn btn-secondary btn-sm"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
        </>
    );
}

export default Pagination;
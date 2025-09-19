import "../styles/pagination.css";

const PaginationSection = ( {currentPage, totalPages, setCurrentPage } ) =>{
    const handlePageChange = (change) =>{
        setCurrentPage(prev=>prev+change);
    }
    return <div className="pagination-container">
        <button className="pagination-navigate" disabled={currentPage===1} onClick={()=>handlePageChange(-1)}>&lt;</button>
        <div className="pagination-current">{currentPage}</div>
        <button className="pagination-navigate" disabled={currentPage===totalPages} onClick={()=>handlePageChange(1)}>&gt;</button>
    </div>
}
export default PaginationSection;
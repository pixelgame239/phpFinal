import "../styles/detail.css";
const handleBack=()=>{
        window.history.back();
    }
const BackButton = () =>{
    return <button className="back-button" onClick={handleBack}>&#60; Back</button>
}
export default BackButton;
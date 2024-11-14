import "./Creategroup.css"
import { useRef } from "react"
import axios from "axios"


const url = process.env.REACT_APP_API_URL
console.log(sessionStorage.getItem('User'))
function CreateGroup() {

    const nameRef = useRef()


    const handleSubmit = async (e) => {
        e.preventDefault()

        const name = nameRef.current.value
        const response = await axios.post(name)
    }
    console.log(sessionStorage.getItem('user'))


    return (
        <div>
            <form onSubmit={ handleSubmit}>
                <div>
                    <label>Group name</label>
                    <input
                    type="text"
                    name="name"
                    ref={nameRef}
                    required
                    />
                    <button type="submit">Submit</button>
                </div>  
            </form>
        </div>
    )
}

export default CreateGroup



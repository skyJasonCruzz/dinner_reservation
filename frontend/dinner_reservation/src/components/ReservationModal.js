import React, {useState} from 'react'
import {getReservationsByUser} from "../api/api"

function Modal(props) {
    const [formData, setFormData] = useState({
        reservation_first_name: '',
        reservation_last_name: '',
        phone_number: '',
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
            try {
                const data = await getReservationsByUser(formData)
                props.setReservations(data)
                props.setIsPersonalReservation(true)
                props.onClose()
            } catch (err) {
                console.log(err)
            }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

            <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">


                <div className="modal-content py-4 text-left px-6">
                    <div className="flex justify-between items-center pb-3">
                        <p className="text-2xl font-bold">Please provide the ff:</p>
                        <div
                            className="modal-close cursor-pointer z-50"
                            onClick={props.onClose}
                        >
                            <svg
                                className="fill-current text-black"
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                            >
                                <path
                                    d="M6.293 6.293a1 1 0 011.414 0L9 7.586l1.293-1.293a1 1 0 111.414 1.414L10.414 9l1.293 1.293a1 1 0 01-1.414 1.414L9 10.414l-1.293 1.293a1 1 0 01-1.414-1.414L7.586 9 6.293 7.707a1 1 0 010-1.414z"
                                ></path>
                            </svg>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-6 group">
                                <input type="text" name="reservation_first_name" id="reservation_first_name"
                                       className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                       placeholder=" "
                                       value={formData.reservation_first_name}
                                       onChange={handleInputChange}
                                       required/>
                                <label htmlFor="reservation_first_name"
                                       className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First
                                    name</label>
                            </div>
                            <div className="relative z-0 w-full mb-6 group">
                                <input type="text" name="reservation_last_name" id="reservation_last_name"
                                       className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                       placeholder=" "
                                       value={formData.reservation_last_name}
                                       onChange={handleInputChange}
                                       required/>
                                <label htmlFor="reservation_last_name"
                                       className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last
                                    name</label>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-6 group">
                                <input type="tel" pattern="[0-9]{11}" name="phone_number"
                                       id="phone_number"
                                       className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                       placeholder=" "
                                       value={formData.phone_number}
                                       onChange={handleInputChange}
                                       required/>
                                <label htmlFor="phone_number"
                                       className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone
                                    [0-9] 11 digits</label>
                            </div>
                        </div>

                        <button type="submit"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ">Submit
                        </button>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default Modal

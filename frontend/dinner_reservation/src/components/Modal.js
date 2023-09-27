import React, {useEffect, useState} from 'react'
import {createReservation, updateReservation} from "../api/api"

function Modal(props) {
    const [formData, setFormData] = useState({
        reservation_first_name: '',
        reservation_last_name: '',
        phone_number: '',
        number_of_guests: 0,
        reservation_date: '',
        reservation_time: '18:00',
    })

    const [errors, setErrors] = useState({
        reservation_date: '',
    })
    const [timeOptions, setTimeOptions] = useState([])

    // use useEffect to fill up the form if there is a reservation to be edited
    useEffect(() => {
        if (props.reservation) {
            const [date, time] = props.reservation.reservation_datetime.split('T')
            setFormData({
                id: props.reservation.id,
                reservation_first_name: props.reservation.reservation_first_name || '',
                reservation_last_name: props.reservation.reservation_last_name || '',
                phone_number: props.reservation.phone_number || '',
                number_of_guests: props.reservation.number_of_guests || 0,
                reservation_date: date || '',
                reservation_time: time.slice(0, 5) || '18:00',
            })
        }
    }, [props.reservation])

    // Generate time options for the reservation time dropdown
    const generateTimeOptions = () => {
        const options = []
        for (let hour = 18; hour <= 21; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const formattedHour = hour.toString().padStart(2, '0')
                const formattedMinute = minute.toString().padStart(2, '0')
                const time = `${formattedHour}:${formattedMinute}`
                options.push({ value: time, label: time })

                if (hour === 21 && minute === 30) {
                    break
                }
            }
        }
        return options
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target


        // Handle validation for the reservation_date on the fly
        if (name === "reservation_date") {
            const datePattern = /^\d{4}-\d{2}-\d{2}$/
            const currentDate = new Date()
            currentDate.setDate(currentDate.getDate() + 2)
            const enteredDate = new Date(value)

            if (enteredDate < currentDate) {
                setErrors({
                    ...errors,
                    [name]: 'Reservation date should be at least 2 days from now.',
                })
            } else if (!datePattern.test(value)) {
                setErrors({
                    ...errors,
                    [name]: 'Invalid date format. Please use YYYY-MM-DD format.',
                })
            } else {
                setErrors({
                    ...errors,
                    [name]: '',
                })
            }
        }

        setFormData({ ...formData, [name]: value })
    }

    const isReservationWithinTwoDays = () => {
        const reservationDate = new Date(formData.reservation_date)
        const currentDate = new Date()
        const timeDifference = reservationDate - currentDate
        const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000
        return timeDifference >= twoDaysInMilliseconds
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (Object.values(errors).every((error) => !error)) {
            try {
                if (props.reservation) {
                    await updateReservation(formData)
                    props.onClose()
                } else {
                    await createReservation(formData)
                    props.onClose()
                }
            } catch (err) {
                if(err === "Date is already reserved.") {
                    alert(`${err} Please choose another date.`)
                }
            }
        }
    }

    const handleCancel = async () => {
        try {
            const updatedReservation = { ...formData, status: "Cancelled" }
            await updateReservation(updatedReservation)
            props.onClose()
        } catch (err) {
            console.log(err)
        }
    }


    useEffect(() => {
        const options = generateTimeOptions()
        setTimeOptions(options)
    }, [])
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

            <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">


                <div className="modal-content py-4 text-left px-6">
                    <div className="flex justify-between items-center pb-3">
                        <p className="text-2xl font-bold">Reservation Form</p>
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
                            <div className="relative z-0 w-full mb-6 group">
                                <input type="number" name="number_of_guests" id="number_of_guests"
                                       min={1} max={5}
                                       className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                       placeholder=" "
                                       value={formData.number_of_guests}
                                       onChange={handleInputChange}
                                       required/>
                                <label htmlFor="number_of_guests"
                                       className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Number of Guests</label>
                            </div>
                            <div className="relative z-0 w-full mb-6 group">
                                <input
                                    type="text"
                                    name="reservation_date"
                                    id="reservation_date"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    value={formData.reservation_date}
                                    onChange={handleInputChange}
                                    autoComplete="off"
                                    required
                                />
                                <label
                                    htmlFor="reservation_date"
                                    className={`peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                                        errors.reservation_date ? 'text-red-500' : ''
                                    }`}
                                >
                                    Date (YYYY-MM-DD)
                                </label>
                                <label
                                    htmlFor="reservation_date"
                                    className={`peer-focus:font-medium text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 text-red-500`}
                                >
                                    {errors.reservation_date ? errors.reservation_date : ''}
                                </label>
                            </div>
                            <div className="relative z-0 w-full mb-6 group">
                                <select
                                    name="reservation_time"
                                    id="reservation_time"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    onChange={handleInputChange}
                                    value={formData.reservation_time}
                                    required
                                >
                                    {timeOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <label
                                    htmlFor="reservation_time"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Desired Time
                                </label>
                            </div>
                        </div>


                        {/*Buttons will only show if the date is valid*/}
                        {props.reservation?.status !== "Cancelled" && isReservationWithinTwoDays() ? (
                            <button
                                type="submit"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
                            >
                                {props.reservation ? "Update" : "Submit"}
                            </button>
                        ) : null}

                        {props.reservation && props.reservation?.status !== "Cancelled" && isReservationWithinTwoDays()? (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="ml-6 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
                            >
                                {props.reservation?.status === "Cancelled" ? "Cancelled" : "Cancel"}
                            </button>
                        ) : null}
                    </form>

                </div>
            </div>
        </div>
    )
}

export default Modal

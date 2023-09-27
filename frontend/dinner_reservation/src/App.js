import React, { useState, useEffect } from 'react'
import Modal from './components/Modal'
import './App.css'
import { getReservations } from './api/api'
import ReservationModal from './components/ReservationModal'

function ReservationTable({ reservations, onSelectReservation, isPersonalReservation}) {
    return (
        <div className="container mx-auto p-4">
            <table className="min-w-full">
                <thead>
                <tr>
                    <th className="px-6 py-3 bg-gray-200 text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider">
                        Reservation Date
                    </th>
                    <th className="px-6 py-3 bg-gray-200 text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider">
                        Reservation Time
                    </th>
                    <th className="px-6 py-3 bg-gray-200 text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider">
                        Status
                    </th>
                </tr>
                </thead>
                <tbody>
                {reservations.map((reservation, index) => {
                    const [date, time] = reservation.reservation_datetime.split('T')

                    const formattedDate = new Date(date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })

                    return (
                        <tr
                            key={index}
                            className={`${
                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            } ${isPersonalReservation ? 'cursor-pointer hover:bg-gray-300' : ''}`}
                            onClick={() => {
                                if (isPersonalReservation) {
                                    onSelectReservation(reservation)
                                }
                            }}
                        >
                            <td className="px-6 py-4 whitespace-no-wrap">{formattedDate}</td>
                            <td className="px-6 py-4 whitespace-no-wrap">{time.slice(0, 5)}</td>
                            <td className="px-6 py-4 whitespace-no-wrap">{reservation.status}</td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
}

function App() {
    const [isPersonalReservation, setIsPersonalReservation] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false)
    const [reservations, setReservations] = useState([])
    const [selectedReservation, setSelectedReservation] = useState(null)

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen)
    }

    const toggleReservationModal = () => {
        setIsReservationModalOpen(!isReservationModalOpen)
    }

    useEffect(() => {
        getReservations()
            .then((reservations) => {
                setReservations(reservations)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-8">Welcome to Dinner Reservation App</h1>
                <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center mr-4"
                    onClick={toggleModal}
                >
                    Create Reservation
                </button>
                <button
                    className="bg-gray-200 hover.bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                    onClick={toggleReservationModal}
                >
                    View Your Reservations
                </button>
            </div>
            {isModalOpen && <Modal onClose={() => {
                toggleModal()
                setSelectedReservation(null)
            }} reservation={selectedReservation} />}
            {isReservationModalOpen && (
                <ReservationModal
                    onClose={toggleReservationModal}
                    setReservations={setReservations}
                    setIsPersonalReservation={setIsPersonalReservation}
                />
            )}
            <h3 className="text-3xl font-bold mt-8">
                {isPersonalReservation ? 'Your Reservations' : 'Current Reservations'}
            </h3>
            <ReservationTable
                reservations={reservations}
                isPersonalReservation={isPersonalReservation}
                onSelectReservation={(reservation) => {
                    setSelectedReservation(reservation)
                    setIsModalOpen(true)
                }}
            />
        </main>
    )
}

export default App

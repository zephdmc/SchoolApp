
import React, { useEffect, useState, useContext, useRef } from 'react';
import { fetchStudentResults } from '../../services/examsRecordService';
import AuthContext from '../../context/AuthContext';
import { getAllClasses } from '../../services/ClassService';
import { getAllTerms } from '../../services/termService';
import { checkOutstandingPayments } from '../../services/Paymentservices';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { getStudentById } from '../../services/studentService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ResultChecker = () => {
    const { user } = useContext(AuthContext);
    const [classId, setClassId] = useState('');
    const [terms, setTerms] = useState([]);
    const [classes, setClasses] = useState([]);
    const [termId, setTermId] = useState('');
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasOutstandingPayment, setHasOutstandingPayment] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const resultRef = useRef(null);

    const studentId = user ? user._id : null;

    const generateVerificationCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const handleFetchResults = async () => {
        if (!classId || !termId) {
            setError('Please select both class and term');
            return;
        }
        
        setError('');
        setIsLoading(true);
        try {

           
            const studentID = await getStudentById(user._id);
            // Check for outstanding payments first
            const paymentStatus = await checkOutstandingPayments(studentID.data.data._id, classId, termId);
            setHasOutstandingPayment(paymentStatus.hasOutstanding);
            
            // Then fetch results
            const data = await fetchStudentResults(studentId, classId, termId);
            setResults(data);
            
            // Generate verification code only if no outstanding payments
            if (!paymentStatus.hasOutstanding) {
                setVerificationCode(generateVerificationCode());
            }
        } catch (err) {
            setError('Error fetching results. Please check the details and try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const data = await getAllClasses();
            setClasses(data);
        } catch (error) {
            console.error('Error fetching class:', error);
        }
    };
    
    const fetchTerms = async () => {
        try {
            const data = await getAllTerms();
            setTerms(data);
        } catch (error) {
            console.error('Error fetching Terms:', error);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        if (!resultRef.current) return;
        
        const canvas = await html2canvas(resultRef.current, {
            scale: 2,
            useCORS: true,
            logging: true,
            allowTaint: true
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`${user.name}_${results.term}_results.pdf`);
    };

    useEffect(() => {
        fetchClasses();
        fetchTerms();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-2 md:p-4">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-blue-600 p-3 md:p-4">
                        <h1 className="text-white text-lg md:text-2xl font-bold">Student Result Checker</h1>
                    </div>
                    
                    <div className="p-3 md:p-4 space-y-3">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                            <select
                                value={classId}
                                onChange={(e) => setClassId(e.target.value)}
                                className="border border-gray-300 rounded p-2 flex-grow text-xs md:text-base"
                                required
                            >
                                <option value="" disabled>Select Class</option>
                                {classes.map((cl) => (
                                    <option key={cl._id} value={cl._id}>
                                        {cl.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={termId}
                                onChange={(e) => setTermId(e.target.value)}
                                className="border border-gray-300 rounded p-2 flex-grow text-xs md:text-base"
                                required
                            >
                                <option value="" disabled>Select Term</option>
                                {terms.map((cl) => (
                                    <option key={cl._id} value={cl._id}>
                                        {cl.name}
                                    </option>
                                ))}
                            </select>

                            <button 
                                onClick={handleFetchResults} 
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs md:text-base transition-colors"
                            >
                                {isLoading ? 'Loading...' : 'Check Result'}
                            </button>
                        </div>

                        {error && (
                            <div className="text-red-500 text-xs md:text-sm p-2 bg-red-50 rounded">
                                {error}
                            </div>
                        )}

                        {hasOutstandingPayment && (
                            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
                                <p className="font-bold">Outstanding Payment Notice</p>
                                <p>Your results cannot be fully displayed due to outstanding payments. Please settle your payments to view complete results.</p>
                            </div>
                        )}

                        {results && (
                            <>
                                <div className="flex justify-end gap-2 mb-2">
                                    {!hasOutstandingPayment && (
                                        <>
                                            <button 
                                                onClick={handleDownloadPDF}
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs md:text-sm transition-colors"
                                            >
                                                Download PDF
                                            </button>
                                            <button 
                                                onClick={handlePrint}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs md:text-sm transition-colors"
                                            >
                                                Print Result
                                            </button>
                                        </>
                                    )}
                                </div>

                                <div className="mt-2" ref={resultRef}>
                                    {/* Printable result section */}
                                    <div className="hidden print:block p-4">
                                        <div className="text-center mb-6">
                                            <div className="flex justify-center mb-2">
                                                <img 
                                                    src="/school-logo.png" 
                                                    alt="School Logo" 
                                                    className="h-16 w-16 object-contain"
                                                />
                                            </div>
                                            <h1 className="text-2xl font-bold">SCHOOL NAME</h1>
                                            <p className="text-sm">123 School Address, City, State</p>
                                            <p className="text-sm">Phone: (123) 456-7890 | Email: info@school.com</p>
                                            <h2 className="text-xl font-bold mt-4">STUDENT TERMINAL REPORT</h2>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div>
                                                <p><span className="font-bold">Student Name:</span> {user.name}</p>
                                                <p><span className="font-bold">Class:</span> {results.className}</p>
                                                <p><span className="font-bold">Academic Session:</span> {results.academicSession}</p>
                                            </div>
                                            <div className="text-right">
                                                <p><span className="font-bold">Term:</span> {results.term}</p>
                                                <p><span className="font-bold">Verification Code:</span> {verificationCode}</p>
                                                <div className="flex justify-end mt-2">
                                                    <QRCode 
                                                        value={`${user._id}-${results.term}-${verificationCode}`} 
                                                        size={80} 
                                                        level="H"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse text-[10px] xs:text-xs sm:text-sm md:text-base">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border p-1 text-left">Subject</th>
                                                    <th className="border p-1 text-center">Assign</th>
                                                    <th className="border p-1 text-center">Test1</th>
                                                    <th className="border p-1 text-center">Test2</th>
                                                    <th className="border p-1 text-center">Test3</th>
                                                    {!hasOutstandingPayment && (
                                                        <>
                                                            <th className="border p-1 text-center">Exam</th>
                                                            <th className="border p-1 text-center">Total</th>
                                                        </>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Array.isArray(results?.results) ? (
                                                    results.results.map((result) => (
                                                        <tr key={result._id} className="hover:bg-gray-50">
                                                            <td className="border p-1 text-left font-medium">{result.subject}</td>
                                                            <td className="border p-1 text-center">{result.assignments}</td>
                                                            <td className="border p-1 text-center">{result.test1}</td>
                                                            <td className="border p-1 text-center">{result.test2}</td>
                                                            <td className="border p-1 text-center">{result.test3}</td>
                                                            {!hasOutstandingPayment && (
                                                                <>
                                                                    <td className="border p-1 text-center">{result.exam}</td>
                                                                    <td className="border p-1 text-center font-bold">{result.total_score}</td>
                                                                </>
                                                            )}
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td 
                                                            colSpan={hasOutstandingPayment ? "5" : "7"} 
                                                            className="border p-2 text-center text-gray-500"
                                                        >
                                                            No results found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {!hasOutstandingPayment && (
                                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs md:text-sm">
                                            <div className="bg-blue-50 p-2 rounded border border-blue-100">
                                                <span className="font-bold">Total Score:</span> {results.totalScore}
                                            </div>
                                            <div className="bg-green-50 p-2 rounded border border-green-100">
                                                <span className="font-bold">Grade:</span> {results.grade}
                                            </div>
                                            <div className="bg-purple-50 p-2 rounded border border-purple-100">
                                                <span className="font-bold">Comment:</span> {results.comment}
                                            </div>
                                        </div>
                                    )}

                                    <div className="hidden print:block mt-8 text-center text-xs">
                                        <p>This result was electronically generated and requires no signature.</p>
                                        <p>Verification can be done by scanning the QR code or entering the verification code at our website.</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultChecker;
import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/"); // bring user back to App Landing page
  };

  return (
    <div className='flex flex-col w-screen h-screen justify-center items-center'>
      <h1 className='text-white text-6xl m-10'>Access Denied!</h1>
      <p className='text-white text-2xl mb-10'>You do not have permission to access this page.</p>
      <button className='btn btn-lg bg-indigo-700' onClick={goBack}>Go Back</button>
    </div>
  );
};

export default AccessDenied;
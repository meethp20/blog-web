import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import Button from './Button';

function LogoutBtn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <Button onClick={handleLogout} className="bg-red-500 text-white">
            Logout
        </Button>
    );
}

export default LogoutBtn;
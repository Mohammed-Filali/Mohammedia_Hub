import React, { useEffect } from 'react';
import { RootState, setUser } from '../redux/store';
import { UserApi } from '../service/UserApi';
import { useDispatch, useSelector } from 'react-redux';

const Profile: React.FC = () => {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');

    const userSetter = async () => {
        try {
            const userData = await UserApi.getUser();
            dispatch(setUser(userData.user));
        } catch (error) {
            console.error('Failed to fetch user:', error);
        }
    };

    useEffect(() => {
        if (token !== 'false' && !user) {
            userSetter();
        }
    }, [user, token, dispatch]);

    return (
        <div
            style={{
                maxWidth: '400px',
                margin: '50px auto',
                textAlign: 'center',
                fontFamily: 'Arial, sans-serif',
                padding: '20px',
            }}
        >
            <div
                style={{
                    borderRadius: '50%',
                    width: '150px',
                    height: '150px',
                    backgroundColor: '#606c38',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '50px',
                    color: '#fff',
                    margin: '0 auto 20px',
                }}
            >
                {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h1
                style={{
                    fontSize: '24px',
                    color: '#333',
                    marginBottom: '10px',
                }}
            >
                {user?.name}
            </h1>
            <p
                style={{
                    fontSize: '16px',
                    color: '#666',
                }}
            >
                {user?.email}
            </p>
        </div>
    );
};

export default Profile;
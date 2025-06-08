import React, { useContext, useEffect, useState } from 'react';
import { Context } from '..';
import { useNavigate } from 'react-router-dom';

export default function SideBar() {
  const [profiles,setprofiles]=useState([]);
  const { setuserid, isAuthenticated, currentEmail } = useContext(Context);
  const navigate = useNavigate();

  if (!isAuthenticated) {
        navigate('/');
    }

  useEffect(()=>{
    const fetchApi=async()=>{
        const response = await fetch("http://localhost:4000/api/use/allemails", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const result = await response.json();
        setprofiles(result.name);
    }

    fetchApi();
  },[]);

  return (
    <div
      style={{
        marginTop:"23px",
        marginLeft:"10px",
        borderRadius:"10px",
        width: '200px',
        background: '#f0f0f0',
        padding: '10px',
        borderRight: '1px solid #ccc',
        height: '92vh',
      }}
    >
      <h3>Profiles</h3>
      {profiles.filter((profile) => profile.email !== currentEmail)
      .map((profile) => (
        <button
          key={profile._id}
          onClick={()=>{setuserid(profile._id)}}
          style={{
            display: 'block',
            width: '100%',
            padding: '10px',
            marginBottom: '5px',
            borderRadius:"10px",
            cursor: 'pointer',
          }}
        >
          {profile.email}
        </button>
      ))}
    </div>
  );
}

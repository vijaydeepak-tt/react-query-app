import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import Header from '../Header.jsx';
import { deleteEvent, fetchEvent, queryClient } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import { useState } from 'react';
import Modal from '../UI/Modal.jsx';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isPending, error, isError } = useQuery({
    queryKey: ['events', { eventId: id }],
    queryFn: (args) => fetchEvent({ ...args, id }),
  });

  const {
    mutate,
    isPending: isDeletePending,
    isError: isDeleteError,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['events'],
        // exact: true,
        refetchType: 'none', // will not trigger until it is required
      });
      navigate('/events');
    },
  });

  const handleStartDeleting = () => {
    setIsDeleting(true);
  };

  const handleStopDeleting = () => {
    setIsDeleting(false);
  };

  const handleDelete = () => {
    mutate({ id });
  };

  let content;

  if (isPending) {
    content = (
      <div id='event-details-content' className='center'>
        <p>Fetching...</p>
      </div>
    );
  }

  if (isError) {
    content = (
      <div id='event-details-content' className='center'>
        <ErrorBlock
          title='An error occurred'
          message={error.info?.message || 'Failed to fetch events'}
        />
      </div>
    );
  }

  if (data) {
    const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    content = (
      <>
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleStartDeleting}>Delete</button>
            <Link to='edit'>Edit</Link>
          </nav>
        </header>
        <div id='event-details-content'>
          <img src={`http://localhost:3000/${data.image}`} alt='' />
          <div id='event-details-info'>
            <div>
              <p id='event-details-location'>{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>
                {formattedDate} @ {data.time}
              </time>
            </div>
            <p id='event-details-description'>{data.description}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {isDeleting && (
        <Modal onClose={handleStopDeleting}>
          <h2>Aru you sure?</h2>
          <p>
            Do you really want to delete this event? This action cannot be
            undone
          </p>
          {isDeletePending && <p>Deleting... Please wait!</p>}
          <div className='form-actions'>
            {!isDeletePending && (
              <>
                <button onClick={handleStopDeleting} className='button-text'>
                  Cancel
                </button>
                <button onClick={handleDelete} className='button'>
                  Delete
                </button>
              </>
            )}
          </div>
          {isDeleteError && (
            <ErrorBlock
              title='Failed to delete Event'
              message={
                deleteError.info?.message ||
                'Failed to delete Event, please try again later'
              }
            />
          )}
        </Modal>
      )}
      <Outlet />
      <Header>
        <Link to='/events' className='nav-item'>
          View all Events
        </Link>
      </Header>
      <article id='event-details'>{content}</article>
    </>
  );
}

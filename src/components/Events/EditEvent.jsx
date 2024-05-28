import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { fetchEvent, queryClient, updateEvent } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isPending, error, isError } = useQuery({
    queryKey: ['events', { eventId: id }],
    queryFn: (args) => fetchEvent({ ...args, id }),
  });

  const { mutate } = useMutation({
    mutationFn: updateEvent,
    onMutate: async (data) => {
      // data is same as the data we are passing as args of mutate function
      const newData = data.event;
      await queryClient.cancelQueries({
        queryKey: ['events', { eventId: id }],
      }); // cancels all the calls with this queryKey

      const prevEvent = queryClient.getQueryData(['events', { eventId: id }]);
      queryClient.setQueryData(['events', { eventId: id }], newData); // setting the data manually for the cached data against the queryKey

      return { prevEvent }; // this will be the data for context in onError args.
    },
    onError: (error, data, context) => {
      queryClient.setQueryData(['events', { eventId: id }], context.prevEvent);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['events', { eventId: id }],
      }); // to fetch the new data is there is any mismatch b/w the local and server
    },
  });

  function handleSubmit(formData) {
    mutate({ id, event: formData });
    navigate('../');
  }

  function handleClose() {
    navigate('../');
  }

  let content;

  if (isPending) {
    content = (
      <div className='center'>
        <LoadingIndicator />
      </div>
    );
  }

  if (isError) {
    content = (
      <>
        <ErrorBlock
          title='Failed to load event'
          message={
            error.info?.message || 'Failed to fetch event, please try later'
          }
        />
        <div className='form-actions'>
          <Link to='../' className='button'>
            Okay
          </Link>
        </div>
      </>
    );
  }

  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to='../' className='button-text'>
          Cancel
        </Link>
        <button type='submit' className='button'>
          Update
        </button>
      </EventForm>
    );
  }

  return <Modal onClose={handleClose}>{content}</Modal>;
}

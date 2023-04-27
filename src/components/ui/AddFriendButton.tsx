'use client';

import { FC, useState } from 'react';
import Button from './Button';
import { addFriendValidator } from '@/lib/validations/add-friend';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface AddFriendButtonProps {}

// Use zod to infer the type of FormData based on the addFriendValidator schema
type FormData = z.infer<typeof addFriendValidator>;

// Define the AddFriendButton functional component with AddFriendButtonProps as its props
const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
  // Declare a state variable to store the success state of the form submission
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);

  // useForm is a custom React Hook for managing form state and validation
  // We pass the zodResolver to useForm to handle validation using our Zod schema (addFriendValidator)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });

  // Define the async function addFriend which takes an email and sends an API request to add the friend
  const addFriend = async (email: string) => {
    try {
      // parse method is provided by the schema object created using the z object from the Zod library
      const validatedEmail = addFriendValidator.parse({ email });
      // Send a POST request to the API with the validated email
      await axios.post('/api/friends/add', {
        email: validatedEmail,
      });

      // If the API request is successful, update the success state
      setShowSuccessState(true);
    } catch (err) {
      // If the error is an instance of ZodError, it means there was a validation error
      if (err instanceof z.ZodError) {
        setError('email', { message: err.message });
        return;
      }

      // If the error is an instance of AxiosError, it means there was an issue with the API request
      if (err instanceof AxiosError) {
        setError('email', { message: err.response?.data });
        return;
      }

      // For any other error, display a generic error message
      setError('email', { message: 'Something went wrong' });
    }
  };

  // Define the onSubmit function to be called when the form is submitted
  const onSubmit = (data: FormData) => {
    // Call the addFriend function with the email from the submitted form data
    addFriend(data.email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='max-w-sm'>
      <label
        htmlFor='email'
        className='block text-sm font-medium leading-6 text-gray-900'
      >
        Add friend by E-Mail
      </label>
      <div className='mt-2 flex gap-4'>
        <input
          {...register('email')}
          type='text'
          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          placeholder='you@example.com'
        />
        <Button>Add</Button>
      </div>
      <p className='mt-1 text-sm text-red-600'>{errors.email?.message}</p>
      {showSuccessState && (
        <p className='mt-1 text-sm text-green-600'>Friend request sent!</p>
      )}
    </form>
  );
};

export default AddFriendButton;

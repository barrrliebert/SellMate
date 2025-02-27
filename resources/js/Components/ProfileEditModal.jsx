import { useState } from 'react';
import Modal from './Modal';
import { useForm } from '@inertiajs/react';
import InputError from './InputError';
import InputLabel from './InputLabel';
import PrimaryButton from './PrimaryButton';
import TextInput from './TextInput';
import SecondaryButton from './SecondaryButton';

export default function ProfileEditModal({ user, show, onClose }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        name: user.name,
        email: user.email,
        school: user.school,
        major: user.major,
        username: user.username,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            onSuccess: () => {
                onClose();
                // Redirect based on user role
                if (user.roles.some(role => role.name === 'users-access')) {
                    window.location.href = route('apps.user.dashboard');
                } else {
                    window.location.href = route('apps.dashboard');
                }
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">Edit Profile</h2>
                <div className="mt-6">
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="school" value="Sekolah" />
                    <TextInput
                        id="school"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.school}
                        onChange={(e) => setData('school', e.target.value)}
                        required
                    />
                    <InputError message={errors.school} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="major" value="Jurusan" />
                    <TextInput
                        id="major"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.major}
                        onChange={(e) => setData('major', e.target.value)}
                        required
                    />
                    <InputError message={errors.major} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="username" value="Username" />
                    <TextInput
                        id="username"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.username}
                        onChange={(e) => setData('username', e.target.value)}
                        required
                    />
                    <InputError message={errors.username} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                    <PrimaryButton className="ms-3" disabled={processing}>
                        Save Changes
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
} 
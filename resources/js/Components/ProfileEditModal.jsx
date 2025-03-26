import { useState, useRef, useEffect } from 'react';
import Modal from './Modal';
import { useForm } from '@inertiajs/react';
import InputError from './InputError';
import InputLabel from './InputLabel';
import PrimaryButton from './PrimaryButton';
import TextInput from './TextInput';
import SecondaryButton from './SecondaryButton';
import toast from 'react-hot-toast';

export default function ProfileEditModal({ user, show, onClose }) {
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [hasAvatarChanged, setHasAvatarChanged] = useState(false);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const fileInputRef = useRef(null);
    
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        name: user.name,
        email: user.email,
        school: user.school || '',  // Keep school in the form data
        major: user.major || '',    // Keep major in the form data
        username: user.username || '',
        avatar: null,
        password: '',
        password_confirmation: '',
        _method: 'PATCH',
    });

    // Reset form when modal opens/closes
    useEffect(() => {
        if (show) {
            setAvatarPreview(null);
            setHasAvatarChanged(false);
            setShowPasswordFields(false);
            reset();
            setData({
                name: user.name,
                email: user.email,
                school: user.school || '',  // Preserve existing school value
                major: user.major || '',    // Preserve existing major value
                username: user.username || '',
                avatar: null,
                password: '',
                password_confirmation: '',
                _method: 'PATCH',
            });
        }
    }, [show, user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Avatar terlalu besar. Ukuran maksimal 2MB.');
                return;
            }
            
            setData('avatar', file);
            setHasAvatarChanged(true);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const togglePasswordFields = () => {
        setShowPasswordFields(!showPasswordFields);
        if (!showPasswordFields) {
            setData('password', '');
            setData('password_confirmation', '');
        }
    };

    const submit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('_method', 'PATCH');
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('school', data.school);
        formData.append('major', data.major);
        formData.append('username', data.username);
        
        // Only include password if it's provided
        if (data.password) {
            formData.append('password', data.password);
            formData.append('password_confirmation', data.password_confirmation);
        }
        
        // Only include avatar if it's changed
        if (hasAvatarChanged && data.avatar) {
            formData.append('avatar', data.avatar);
        }
        
        post(route('profile.update'), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                onClose();
                toast.success('Profil berhasil diperbarui!');
                
                // Redirect based on user role
                if (user.roles.some(role => role.name === 'users-access')) {
                    window.location.href = route('apps.user.dashboard');
                } else {
                    window.location.href = route('apps.dashboard');
                }
            },
            onError: (errors) => {
                toast.error('Gagal memperbarui profil. Silakan periksa kembali data Anda.');
            }
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">Edit Profile</h2>
                
                {/* Avatar Upload */}
                <div className="mt-6 flex flex-col items-center">
                    <div 
                        className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500 cursor-pointer bg-gray-100"
                        onClick={triggerFileInput}
                    >
                        <img 
                            src={avatarPreview || user.avatar} 
                            alt={user.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // If image fails to load, fallback to a default icon
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&bold=true&size=256`;
                            }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <span className="text-white text-xs font-medium">Change Photo</span>
                        </div>
                    </div>
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <button 
                        type="button" 
                        onClick={triggerFileInput}
                        className="mt-2 text-sm text-purple-600 hover:text-purple-800"
                    >
                        {user.avatar && !avatarPreview ? 'Ganti Avatar' : 'Upload Avatar'}
                    </button>
                    <InputError message={errors.avatar} className="mt-2 text-center" />
                </div>

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

                {/* Password Toggle Button */}
                <div className="mt-6">
                    <button
                        type="button"
                        onClick={togglePasswordFields}
                        className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
                    >
                        <span>{showPasswordFields ? 'Batal ubah password' : 'Ubah password'}</span>
                    </button>
                </div>

                {/* Password Fields (Conditional) */}
                {showPasswordFields && (
                    <div className="mt-4 space-y-4">
                        <div>
                            <InputLabel htmlFor="password" value="Password Baru" />
                            <TextInput
                                id="password"
                                type="password"
                                className="mt-1 block w-full"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                autoComplete="new-password"
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                className="mt-1 block w-full"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                autoComplete="new-password"
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>
                    </div>
                )}

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
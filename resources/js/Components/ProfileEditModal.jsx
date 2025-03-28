import { useState, useRef, useEffect } from 'react';
import Modal1 from './Modal1';
import { useForm } from '@inertiajs/react';
import InputError from './InputError';
import TextInput from './TextInput';
import toast from 'react-hot-toast';
import { IconEye, IconEyeOff, IconCamera } from '@tabler/icons-react';

export default function ProfileEditModal({ user, show, onClose }) {
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [hasAvatarChanged, setHasAvatarChanged] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const fileInputRef = useRef(null);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: user.name,
        email: user.email,
        school: user.school || '',
        major: user.major || '',
        username: user.username || '',
        avatar: null,
        password: '',
        _method: 'PATCH',
    });

    useEffect(() => {
        if (show) {
            setAvatarPreview(null);
            setHasAvatarChanged(false);
            reset();
            setData({
                name: user.name,
                email: user.email,
                school: user.school || '',
                major: user.major || '',
                username: user.username || '',
                avatar: null,
                password: '',
                _method: 'PATCH',
            });
        }
    }, [show, user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Avatar terlalu besar. Ukuran maksimal 2MB.');
                return;
            }
            
            setData('avatar', file);
            setHasAvatarChanged(true);
            
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

    const submit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('_method', 'PATCH');
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('school', data.school);
        formData.append('major', data.major);
        formData.append('username', data.username);
        
        if (data.password) {
            formData.append('password', data.password);
        }
        
        if (hasAvatarChanged && data.avatar) {
            formData.append('avatar', data.avatar);
        }
        
        post(route('profile.update'), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                onClose();
                toast.success('Profil berhasil diperbarui!');
                
                if (user.roles.some(role => role.name === 'users-access')) {
                    window.location.href = route('apps.user.dashboard');
                } else {
                    window.location.href = route('apps.dashboard');
                }
            },
            onError: () => {
                toast.error('Gagal memperbarui profil. Silakan periksa kembali data Anda.');
            }
        });
    };

    return (
        <Modal1 show={show} onClose={onClose}>
            <>
                <style>
                    {`
                        .scrollbar-hide::-webkit-scrollbar {
                            display: none;
                        }
                        .scrollbar-hide {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                    `}
                </style>
                <div className="bg-white border-2 border-[#D4A8EF] rounded-xl">
                    <div className="p-4 space-y-4 max-h-[85vh] overflow-y-auto scrollbar-hide">
                        <h2 className="text-xl font-bold text-gray-900">Profile</h2>
                        
                        {/* Profile Container */}
                        <div className="p-4 border-2 border-[#D4A8EF] rounded-xl bg-white">
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <div 
                                        className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#D4A8EF] cursor-pointer bg-gray-100"
                                        onClick={triggerFileInput}
                                    >
                                        <img 
                                            src={avatarPreview || user.avatar} 
                                            alt={user.name} 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&bold=true&size=256`;
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                            <span className="text-white text-xs font-medium">Change Photo</span>
                                        </div>
                                    </div>
                                    {/* Add Image Icon */}
                                    <div 
                                        className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border-2 border-[#D4A8EF] flex items-center justify-center cursor-pointer hover:bg-gray-50"
                                        onClick={triggerFileInput}
                                    >
                                        <IconCamera size={18} className="text-[#D4A8EF]" />
                                    </div>
                                </div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <h3 className="mt-4 text-md font-semibold text-gray-900">{user.name}</h3>
                            </div>
                        </div>

                        {/* General Information Container */}
                        <div className="p-4 border-2 border-[#D4A8EF] rounded-xl bg-white">
                            <h3 className="text-md font-semibold text-gray-900 mb-2">General Information</h3>
                            <div className="space-y-1">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Nama Lengkap
                                    </label>
                                    <TextInput
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full border-2 !border-[#D4A8EF] rounded-lg p-2 focus:!border-[#D4A8EF] focus:!ring-[#D4A8EF]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Nama Sekolah
                                    </label>
                                    <TextInput
                                        type="text"
                                        value={data.school}
                                        disabled
                                        className="w-full border-2 border-gray-200 rounded-lg p-2 bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Jurusan
                                    </label>
                                    <TextInput
                                        type="text"
                                        value={data.major}
                                        disabled
                                        className="w-full border-2 border-gray-200 rounded-lg p-2 bg-gray-100"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Security Container */}
                        <div className="p-4 border-2 border-[#D4A8EF] rounded-xl bg-white">
                            <h3 className="text-md font-semibold text-gray-900 mb-2">Security</h3>
                            <div className="space-y-1">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Username
                                    </label>
                                    <TextInput
                                        type="text"
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                        className="w-full border-2 !border-[#D4A8EF] rounded-lg p-2 focus:!border-[#D4A8EF] focus:!ring-[#D4A8EF]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <TextInput
                                            type={showPassword ? "text" : "password"}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full border-2 !border-[#D4A8EF] rounded-lg p-2 focus:!border-[#D4A8EF] focus:!ring-[#D4A8EF]"
                                            placeholder="Masukkan password baru"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? (
                                                <IconEyeOff size={20} strokeWidth={1.5} />
                                            ) : (
                                                <IconEye size={20} strokeWidth={1.5} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <TextInput
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full border-2 !border-[#D4A8EF] rounded-lg p-2 focus:!border-[#D4A8EF] focus:!ring-[#D4A8EF]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border-2 border-[#D4A8EF] text-[#D4A8EF] rounded-lg hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={submit}
                                disabled={processing}
                                className="px-4 py-2 bg-[#D4A8EF] text-white rounded-lg hover:bg-[#C088E3]"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            </>
        </Modal1>
    );
} 
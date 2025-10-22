import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from './styles/themes';

const AdmissionForm = () => {
    const theme = useTheme();
    const [submitted, setSubmitted] = useState(false);
    const [showUnderFiveCard, setShowUnderFiveCard] = useState(false);
    const [showAllergyDetails, setShowAllergyDetails] = useState(false);
    const [showVaccinationDetails, setShowVaccinationDetails] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const signatureRef = useRef(null);
    
    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleChange = useCallback((section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    }, [errors]);

    const handleFileChange = (field, e) => {
        handleChange('documents', field, e.target.files[0]);
    };

    const [formData, setFormData] = useState({
        childInfo: {
            firstName: '',
            surname: '',
            dob: '',
            age: '',
            placeOfBirth: '',
            nationality: '',
            religion: ''
        },
        parentInfo: {
            fathersName: '',
            fathersContact: '',
            mothersName: '',
            mothersContact: '',
            residentialAddress: ''
        },
        healthInfo: {
            hasAllergies: 'No',
            allergyDetails: '',
            isVaccinated: 'Yes',
            vaccinationDetails: '',
            doctorDetails: '',
            doctorContact: '',
            emergencyContacts: []
        },
        documents: {
            underFiveCard: null,
            passportPhoto: null
        },
        declaration: {
            declarationName: '',
            signatureData: ''
        },
        otherInfo: ''
    });

    useEffect(() => {
        if (formData.childInfo.dob) {
            const dob = new Date(formData.childInfo.dob);
            const ageDiff = Date.now() - dob.getTime();
            const ageDate = new Date(ageDiff);
            const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
            handleChange('childInfo', 'age', calculatedAge.toString());
            setShowUnderFiveCard(calculatedAge < 5);
        }
    }, [formData.childInfo.dob, handleChange]);

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.childInfo.firstName.trim()) newErrors.firstName = 'First name is required';
            if (!formData.childInfo.surname.trim()) newErrors.surname = 'Surname is required';
            if (!formData.childInfo.dob) newErrors.dob = 'Date of birth is required';
            if (!formData.childInfo.placeOfBirth.trim()) newErrors.placeOfBirth = 'Place of birth is required';
            if (!formData.childInfo.nationality.trim()) newErrors.nationality = 'Nationality is required';
        }

        if (step === 2) {
            if (!formData.parentInfo.fathersName.trim() && !formData.parentInfo.mothersName.trim()) {
                newErrors.parentName = 'At least one parent name is required';
            }
            if (!formData.parentInfo.residentialAddress.trim()) newErrors.residentialAddress = 'Address is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCheckboxChange = (section, field, value, isChecked) => {
        setFormData(prev => {
            const currentValues = [...prev[section][field]];
            if (isChecked) {
                currentValues.push(value);
            } else {
                const index = currentValues.indexOf(value);
                if (index > -1) {
                    currentValues.splice(index, 1);
                }
            }
            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: currentValues
                }
            };
        });
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep(currentStep)) return;

        try {
            setIsSubmitting(true);
            const formPayload = new FormData();

            // Append form data
            Object.entries(formData).forEach(([section, fields]) => {
                if (section === 'documents') return; // Handle files separately
                
                Object.entries(fields).forEach(([field, value]) => {
                    if (Array.isArray(value)) {
                        value.forEach(item => formPayload.append(`${section}.${field}[]`, item));
                    } else if (value !== null && value !== undefined) {
                        formPayload.append(`${section}.${field}`, value);
                    }
                });
            });

            // Append files
            if (!formData.documents.passportPhoto) {
                throw new Error('Passport photo is required');
            }
            formPayload.append('passportPhoto', formData.documents.passportPhoto);

            if (formData.documents.underFiveCard) {
                formPayload.append('underFiveCard', formData.documents.underFiveCard);
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admissions`, {
                method: 'POST',
                body: formPayload
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Submission failed');
            }

            setSubmitted(true);
        } catch (error) {
            console.error('Submission error:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const setupSignaturePad = useCallback(() => {
        const canvas = signatureRef.current;
        if (!canvas) return;
        
        // Adjust canvas size for mobile
        if (isMobile) {
            canvas.width = Math.min(window.innerWidth - 40, 300);
            canvas.height = 150;
        }
        
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        // Mouse events for desktop
        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            lastX = e.clientX - rect.left;
            lastY = e.clientY - rect.top;
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
            lastX = x;
            lastY = y;
        });

        canvas.addEventListener('mouseup', () => {
            isDrawing = false;
            handleChange('declaration', 'signatureData', canvas.toDataURL());
        });

        canvas.addEventListener('mouseout', () => {
            isDrawing = false;
        });
        
        // Touch events for mobile
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            lastX = touch.clientX - rect.left;
            lastY = touch.clientY - rect.top;
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
            lastX = x;
            lastY = y;
        });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            isDrawing = false;
            handleChange('declaration', 'signatureData', canvas.toDataURL());
        });
    }, [handleChange, isMobile]);

    const clearSignature = () => {
        const canvas = signatureRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        handleChange('declaration', 'signatureData', '');
    };

    useEffect(() => {
        setupSignaturePad();
    }, [setupSignaturePad]);

    const getFormStage = (step) => {
        switch (step) {
            case 1: return 'student_info';
            case 2: return 'parent_info';
            case 3: return 'academic_info';
            case 4: return 'medical_info';
            default: return 'unknown';
        }
    };

    if (submitted) {
        return <SuccessMessage theme={theme} />;
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: theme.colors.primaryLight,
            padding: isMobile ? theme.sizes.spacing.md : theme.sizes.spacing.xl
        }}>
            <div style={{
                maxWidth: theme.sizes.container.form,
                margin: '0 auto'
            }}>
                <header style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.white,
                    padding: isMobile ? theme.sizes.spacing.md : theme.sizes.spacing.lg,
                    borderRadius: `${theme.sizes.borderRadius.medium} ${theme.sizes.borderRadius.medium} 0 0`,
                    textAlign: 'center'
                }}>
                    <img
                        src="/school-logo.jpg"
                        alt="Literacy Tree School Logo"
                        style={{
                            height: isMobile ? '60px' : theme.sizes.header.height,
                            marginBottom: theme.sizes.spacing.md
                        }}
                    />
                    <h1 style={{
                        fontFamily: theme.fonts.heading,
                        margin: 0,
                        fontSize: isMobile ? '1.4rem' : '1.8rem'
                    }}>
                        Literacy Tree School Admission Form
                    </h1>
                    <p style={{
                        margin: `${theme.sizes.spacing.sm} 0 0`,
                        fontWeight: 600,
                        opacity: 0.9,
                        fontSize: isMobile ? '0.9rem' : '1rem'
                    }}>
                        2025-2026 Academic Year - {getFormStage(currentStep).replace('_', ' ').toUpperCase()}
                    </p>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: theme.sizes.spacing.lg,
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: isMobile ? theme.sizes.spacing.sm : 0
                    }}>
                        {[1, 2, 3, 4].map(step => (
                            <div
                                key={step}
                                style={{
                                    flex: 1,
                                    textAlign: 'center',
                                    padding: isMobile ? theme.sizes.spacing.xs : theme.sizes.spacing.sm,
                                    backgroundColor: currentStep >= step ? theme.colors.accent : theme.colors.gray[200],
                                    color: currentStep >= step ? theme.colors.white : theme.colors.text,
                                    fontWeight: currentStep >= step ? 600 : 400,
                                    position: 'relative',
                                    fontSize: isMobile ? '0.8rem' : '1rem'
                                }}
                            >
                                {step === 1 && 'Student'}
                                {step === 2 && 'Parent'}
                                {step === 3 && 'Academic'}
                                {step === 4 && 'Medical'}
                            </div>
                        ))}
                    </div>
                </header>

                <form onSubmit={handleSubmit} style={{
                    backgroundColor: theme.colors.white,
                    padding: isMobile ? theme.sizes.spacing.md : theme.sizes.spacing.xl,
                    borderRadius: `0 0 ${theme.sizes.borderRadius.medium} ${theme.sizes.borderRadius.medium}`,
                    boxShadow: theme.shadows.md
                }}>
                    {currentStep === 1 && (
                        <FormSection title="Child Information" theme={theme}>
                            <TextInput
                                label="Child's First Name"
                                value={formData.childInfo.firstName}
                                onChange={(value) => handleChange('childInfo', 'firstName', value)}
                                error={errors.firstName}
                                required
                                theme={theme}
                                isMobile={isMobile}
                            />
                            <TextInput
                                label="Child's Surname"
                                value={formData.childInfo.surname}
                                onChange={(value) => handleChange('childInfo', 'surname', value)}
                                error={errors.surname}
                                required
                                theme={theme}
                                isMobile={isMobile}
                            />
                            <TextInput
                                label="Date of Birth"
                                type="date"
                                value={formData.childInfo.dob}
                                onChange={(value) => handleChange('childInfo', 'dob', value)}
                                error={errors.dob}
                                required
                                theme={theme}
                                isMobile={isMobile}
                            />
                            <TextInput
                                label="Child's Age"
                                value={formData.childInfo.age}
                                readOnly
                                theme={theme}
                                isMobile={isMobile}
                            />
                            <TextInput
                                label="Place of Birth"
                                value={formData.childInfo.placeOfBirth}
                                onChange={(value) => handleChange('childInfo', 'placeOfBirth', value)}
                                error={errors.placeOfBirth}
                                required
                                theme={theme}
                                isMobile={isMobile}
                            />
                            <TextInput
                                label="Nationality"
                                value={formData.childInfo.nationality}
                                onChange={(value) => handleChange('childInfo', 'nationality', value)}
                                error={errors.nationality}
                                required
                                theme={theme}
                                isMobile={isMobile}
                            />
                            <TextInput
                                label="Religion"
                                value={formData.childInfo.religion}
                                onChange={(value) => handleChange('childInfo', 'religion', value)}
                                theme={theme}
                                isMobile={isMobile}
                            />
                            <FormNavigation
                                onNext={nextStep}
                                nextDisabled={false}
                                isSubmitting={isSubmitting}
                                theme={theme}
                                isMobile={isMobile}
                            />
                        </FormSection>
                    )}

                    {currentStep === 2 && (
                        <FormSection title="Parent/Guardian Information" theme={theme}>
                            <TextInput
                                label="Father's Name"
                                value={formData.parentInfo.fathersName}
                                onChange={(value) => handleChange('parentInfo', 'fathersName', value)}
                                theme={theme}
                                isMobile={isMobile}
                            />
                            <TextInput
                                label="Father's Contact Number"
                                type="tel"
                                value={formData.parentInfo.fathersContact}
                                onChange={(value) => handleChange('parentInfo', 'fathersContact', value)}
                                theme={theme}
                                isMobile={isMobile}
                            />
                            <TextInput
                                label="Mother's Name"
                                value={formData.parentInfo.mothersName}
                                onChange={(value) => handleChange('parentInfo', 'mothersName', value)}
                                theme={theme}
                                isMobile={isMobile}
                            />
                            <TextInput
                                label="Mother's Contact Number"
                                type="tel"
                                value={formData.parentInfo.mothersContact}
                                onChange={(value) => handleChange('parentInfo', 'mothersContact', value)}
                                theme={theme}
                                isMobile={isMobile}
                            />
                            <TextArea
                                label="Residential Address"
                                value={formData.parentInfo.residentialAddress}
                                onChange={(value) => handleChange('parentInfo', 'residentialAddress', value)}
                                error={errors.residentialAddress}
                                required
                                theme={theme}
                                isMobile={isMobile}
                            />
                            <FormNavigation
                                onPrev={prevStep}
                                onNext={nextStep}
                                isSubmitting={isSubmitting}
                                theme={theme}
                                isMobile={isMobile}
                            />
                        </FormSection>
                    )}

                    {currentStep === 3 && (
                        <FormSection title="Health Information" theme={theme}>
                            <SelectInput
                                label="Does the child have allergies?"
                                value={formData.healthInfo.hasAllergies}
                                onChange={(value) => {
                                    handleChange('healthInfo', 'hasAllergies', value);
                                    setShowAllergyDetails(value === 'Yes');
                                }}
                                options={[
                                    { value: 'No', label: 'No' },
                                    { value: 'Yes', label: 'Yes' }
                                ]}
                                theme={theme}
                                isMobile={isMobile}
                            />
                            {showAllergyDetails && (
                                <TextArea
                                    label="If yes, specify allergies"
                                    value={formData.healthInfo.allergyDetails}
                                    onChange={(value) => handleChange('healthInfo', 'allergyDetails', value)}
                                    theme={theme}
                                    isMobile={isMobile}
                                />
                            )}
                            <SelectInput
                                label="Has the child been vaccinated?"
                                value={formData.healthInfo.isVaccinated}
                                onChange={(value) => {
                                    handleChange('healthInfo', 'isVaccinated', value);
                                    setShowVaccinationDetails(value === 'No');
                                }}
                                options={[
                                    { value: 'Yes', label: 'Yes' },
                                    { value: 'No', label: 'No' }
                                ]}
                                theme={theme}
                                isMobile={isMobile}
                            />
                            {showVaccinationDetails && (
                                <TextArea
                                    label="If no, specify vaccination details"
                                    value={formData.healthInfo.vaccinationDetails}
                                    onChange={(value) => handleChange('healthInfo', 'vaccinationDetails', value)}
                                    theme={theme}
                                    isMobile={isMobile}
                                />
                            )}

                            <CheckboxGroup
                                label="Emergency Contact Methods (Select all that apply)"
                                options={['Phone', 'Email', 'SMS', 'WhatsApp']}
                                selected={formData.healthInfo.emergencyContacts}
                                onChange={(value, checked) => handleCheckboxChange('healthInfo', 'emergencyContacts', value, checked)}
                                theme={theme}
                                isMobile={isMobile}
                            />

                            <TextArea
                                label="Doctor's Details"
                                value={formData.healthInfo.doctorDetails}
                                onChange={(value) => handleChange('healthInfo', 'doctorDetails', value)}
                                theme={theme}
                                isMobile={isMobile}
                            />
                            <TextInput
                                label="Doctor's Contact Number"
                                type="tel"
                                value={formData.healthInfo.doctorContact}
                                onChange={(value) => handleChange('healthInfo', 'doctorContact', value)}
                                theme={theme}
                                isMobile={isMobile}
                            />

                            <FormNavigation
                                onPrev={prevStep}
                                onNext={nextStep}
                                isSubmitting={isSubmitting}
                                theme={theme}
                                isMobile={isMobile}
                            />
                        </FormSection>
                    )}

                    {currentStep === 4 && (
                        <FormSection title="Documents & Declaration" theme={theme}>
                            <div id="underFiveCardLabel" style={{ display: formData.childInfo.age < 5 ? 'block' : 'none' }}>
                                {showUnderFiveCard && (
                                    <FileInput
                                        label="Upload Child's Under Five Card"
                                        id="underFiveCard"
                                        onChange={(e) => handleFileChange('underFiveCard', e)}
                                        accept="image/*"
                                        theme={theme}
                                        isMobile={isMobile}
                                    />
                                )}
                            </div>
                            <FileInput
                                label="Upload a Passport Size Photo"
                                id="passportPhoto"
                                onChange={(e) => handleFileChange('passportPhoto', e)}
                                accept="image/*"
                                theme={theme}
                                isMobile={isMobile}
                            />
                            <TextArea
                                label="Any other information about the child"
                                value={formData.otherInfo}
                                onChange={(value) => handleChange('', 'otherInfo', value)}
                                theme={theme}
                                isMobile={isMobile}
                            />
                            <div style={{ margin: `${theme.sizes.spacing.lg} 0` }}>
                                <p style={{ 
                                    marginBottom: theme.sizes.spacing.sm,
                                    fontSize: isMobile ? '0.9rem' : '1rem',
                                    lineHeight: isMobile ? '1.4' : '1.6'
                                }}>
                                    I, <TextInput
                                        inline
                                        value={formData.declaration.declarationName}
                                        onChange={(value) => handleChange('declaration', 'declarationName', value)}
                                        placeholder="Enter your full name"
                                        required
                                        theme={theme}
                                        isMobile={isMobile}
                                    />, hereby agree to pay all tuition fees in good time and that my child will comply with all school regulations.
                                </p>
                                <div style={{ margin: `${theme.sizes.spacing.md} 0` }}>
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: theme.sizes.spacing.sm,
                                        fontSize: isMobile ? '0.9rem' : '1rem'
                                    }}>Parent's Signature:</label>
                                    <div style={{ 
                                        overflow: 'auto',
                                        maxWidth: '100%',
                                        marginBottom: theme.sizes.spacing.sm
                                    }}>
                                        <canvas
                                            ref={signatureRef}
                                            id="signatureCanvas"
                                            width={isMobile ? Math.min(window.innerWidth - 40, 300) : 300}
                                            height={150}
                                            style={{ 
                                                border: `1px solid ${theme.colors.border}`, 
                                                borderRadius: theme.sizes.borderRadius.small,
                                                maxWidth: '100%',
                                                touchAction: 'none'
                                            }}
                                        ></canvas>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={clearSignature}
                                        style={{
                                            marginTop: theme.sizes.spacing.sm,
                                            background: 'none',
                                            border: 'none',
                                            color: theme.colors.primary,
                                            textDecoration: 'underline',
                                            cursor: 'pointer',
                                            fontSize: isMobile ? '0.9rem' : '1rem'
                                        }}
                                    >
                                        Clear Signature
                                    </button>
                                </div>
                            </div>
                            <p style={{ 
                                fontStyle: 'italic', 
                                textAlign: 'center', 
                                marginTop: theme.sizes.spacing.lg,
                                fontSize: isMobile ? '0.9rem' : '1rem'
                            }}>
                                "TO TEACH IS TO TOUCH A LIFE FOREVER."
                            </p>
                            <FormNavigation
                                onPrev={prevStep}
                                onSubmit={handleSubmit}
                                isLastStep={true}
                                isSubmitting={isSubmitting}
                                theme={theme}
                                isMobile={isMobile}
                            />
                        </FormSection>
                    )}
                </form>
            </div>
        </div>
    );
};

// Reusable Form Components
const FormSection = ({ title, children, theme }) => {
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    
    return (
        <div>
            <h2 style={{
                color: theme.colors.primaryDark,
                fontFamily: theme.fonts.heading,
                marginBottom: theme.sizes.spacing.lg,
                paddingBottom: theme.sizes.spacing.sm,
                borderBottom: `2px solid ${theme.colors.gray[200]}`,
                fontSize: isMobile ? '1.4rem' : '1.6rem'
            }}>
                {title}
            </h2>
            <div style={{ marginBottom: theme.sizes.spacing.xl }}>
                {children}
            </div>
        </div>
    );
};

const FileInput = ({ label, id, onChange, accept, theme, isMobile }) => {
    return (
        <div style={{ marginBottom: theme.sizes.spacing.lg }}>
            <label style={{
                display: 'block',
                marginBottom: theme.sizes.spacing.sm,
                fontWeight: 600,
                color: theme.colors.text,
                fontSize: isMobile ? '0.9rem' : '1rem'
            }}>
                {label}
            </label>
            <input
                type="file"
                id={id}
                onChange={onChange}
                accept={accept}
                style={{
                    width: '100%',
                    padding: isMobile ? theme.sizes.spacing.sm : theme.sizes.spacing.sm,
                    fontFamily: theme.fonts.main,
                    fontSize: isMobile ? '0.9rem' : '1rem'
                }}
            />
        </div>
    );
};

const TextInput = ({ label, type = 'text', value, onChange, error, required, placeholder, theme, inline, isMobile }) => {
    const handleInputChange = (e) => {
        // Support both direct value calls and event object calls
        if (typeof onChange === 'function') {
            onChange(e.target.value);
        }
    };

    if (inline) {
        return (
            <input
                type={type}
                value={value}
                onChange={handleInputChange}
                required={required}
                placeholder={placeholder}
                style={{
                    display: 'inline',
                    minWidth: isMobile ? '150px' : '200px',
                    padding: isMobile ? '0.2rem 0.4rem' : '0.25rem 0.5rem',
                    border: `1px solid ${error ? theme.colors.error : theme.colors.border}`,
                    borderRadius: theme.sizes.borderRadius.small,
                    fontFamily: theme.fonts.main,
                    margin: '0 0.25rem',
                    fontSize: isMobile ? '0.9rem' : '1rem'
                }}
            />
        );
    }

    return (
        <div style={{ marginBottom: theme.sizes.spacing.lg }}>
            <label style={{
                display: 'block',
                marginBottom: theme.sizes.spacing.sm,
                fontWeight: 600,
                color: theme.colors.text,
                fontSize: isMobile ? '0.9rem' : '1rem'
            }}>
                {label}
                {required && <span style={{ color: theme.colors.error }}>*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={handleInputChange}
                required={required}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    padding: isMobile ? theme.sizes.spacing.sm : theme.sizes.spacing.sm,
                    border: `1px solid ${error ? theme.colors.error : theme.colors.border}`,
                    borderRadius: theme.sizes.borderRadius.small,
                    fontFamily: theme.fonts.main,
                    fontSize: isMobile ? '0.9rem' : '1rem'
                }}
            />
            {error && (
                <div style={{
                    color: theme.colors.error,
                    fontSize: isMobile ? '0.8rem' : '0.875rem',
                    marginTop: theme.sizes.spacing.sm
                }}>
                    {error}
                </div>
            )}
        </div>
    );
};

const TextArea = ({ label, value, onChange, error, required, placeholder, theme, isMobile }) => {
    const handleTextAreaChange = (e) => {
        if (typeof onChange === 'function') {
            onChange(e.target.value);
        }
    };
    return (
        <div style={{ marginBottom: theme.sizes.spacing.lg }}>
            <label style={{
                display: 'block',
                marginBottom: theme.sizes.spacing.sm,
                fontWeight: 600,
                color: theme.colors.text,
                fontSize: isMobile ? '0.9rem' : '1rem'
            }}>
                {label}
                {required && <span style={{ color: theme.colors.error }}>*</span>}
            </label>
            <textarea
                value={value}
                onChange={handleTextAreaChange}
                required={required}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    minHeight: isMobile ? '80px' : '100px',
                    padding: theme.sizes.spacing.sm,
                    border: `1px solid ${error ? theme.colors.error : theme.colors.border}`,
                    borderRadius: theme.sizes.borderRadius.small,
                    fontFamily: theme.fonts.main,
                    resize: 'vertical',
                    fontSize: isMobile ? '0.9rem' : '1rem'
                }}
            />
            {error && (
                <div style={{
                    color: theme.colors.error,
                    fontSize: isMobile ? '0.8rem' : '0.875rem',
                    marginTop: theme.sizes.spacing.sm
                }}>
                    {error}
                </div>
            )}
        </div>
    );
};

const SelectInput = ({ label, value, onChange, options, error, required, theme, isMobile }) => {
    const handleSelectChange = (e) => {
        if (typeof onChange === 'function') {
            onChange(e.target.value);
        }
    };

    return (
        <div style={{ marginBottom: theme.sizes.spacing.lg }}>
            <label style={{
                display: 'block',
                marginBottom: theme.sizes.spacing.sm,
                fontWeight: 600,
                color: theme.colors.text,
                fontSize: isMobile ? '0.9rem' : '1rem'
            }}>
                {label}
                {required && <span style={{ color: theme.colors.error }}>*</span>}
            </label>
            <select
                value={value}
                onChange={handleSelectChange}
                required={required}
                style={{
                    width: '100%',
                    padding: isMobile ? theme.sizes.spacing.sm : theme.sizes.spacing.sm,
                    border: `1px solid ${error ? theme.colors.error : theme.colors.border}`,
                    borderRadius: theme.sizes.borderRadius.small,
                    fontFamily: theme.fonts.main,
                    fontSize: isMobile ? '0.9rem' : '1rem'
                }}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <div style={{
                    color: theme.colors.error,
                    fontSize: isMobile ? '0.8rem' : '0.875rem',
                    marginTop: theme.sizes.spacing.sm
                }}>
                    {error}
                </div>
            )}
        </div>
    );
};

const CheckboxGroup = ({ label, options, selected, onChange, theme, isMobile }) => {
    const handleChange = (option, isChecked) => {
        if (typeof onChange === 'function') {
            onChange(option, isChecked);
        }
    };

    return (
        <div style={{ marginBottom: theme.sizes.spacing.lg }}>
            <label style={{
                display: 'block',
                marginBottom: theme.sizes.spacing.sm,
                fontWeight: 600,
                color: theme.colors.text,
                fontSize: isMobile ? '0.9rem' : '1rem'
            }}>
                {label}
            </label>
            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: isMobile ? theme.sizes.spacing.sm : theme.sizes.spacing.md 
            }}>
                {options.map(option => (
                    <label key={option} style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontSize: isMobile ? '0.9rem' : '1rem'
                    }}>
                        <input
                            type="checkbox"
                            checked={selected.includes(option)}
                            onChange={(e) => handleChange(option, e.target.checked)}
                            style={{
                                marginRight: theme.sizes.spacing.sm,
                                accentColor: theme.colors.primary,
                                transform: isMobile ? 'scale(1.2)' : 'scale(1)'
                            }}
                        />
                        {option}
                    </label>
                ))}
            </div>
        </div>
    );
};

const FormNavigation = ({
    onPrev,
    onNext,
    onSubmit,
    isLastStep = false,
    nextDisabled = false,
    isSubmitting = false,
    theme,
    isMobile
}) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: theme.sizes.spacing.xl,
            paddingTop: theme.sizes.spacing.lg,
            borderTop: `1px solid ${theme.colors.gray[200]}`,
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? theme.sizes.spacing.md : 0
        }}>
            {onPrev ? (
                <button
                    type="button"
                    onClick={onPrev}
                    style={{
                        backgroundColor: theme.colors.gray[200],
                        color: theme.colors.text,
                        border: 'none',
                        padding: isMobile ? `${theme.sizes.spacing.sm} ${theme.sizes.spacing.md}` : `${theme.sizes.spacing.sm} ${theme.sizes.spacing.lg}`,
                        borderRadius: theme.sizes.borderRadius.small,
                        cursor: 'pointer',
                        fontFamily: theme.fonts.main,
                        fontWeight: 600,
                        fontSize: isMobile ? '0.9rem' : '1rem',
                        order: isMobile ? 2 : 1
                    }}
                >
                    Previous
                </button>
            ) : (
                <div style={{ order: isMobile ? 2 : 1 }}></div>
            )}

            {isLastStep ? (
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    style={{
                        backgroundColor: isSubmitting ? theme.colors.gray[300] : theme.colors.success,
                        color: theme.colors.white,
                        border: 'none',
                        padding: isMobile ? `${theme.sizes.spacing.sm} ${theme.sizes.spacing.md}` : `${theme.sizes.spacing.sm} ${theme.sizes.spacing.lg}`,
                        borderRadius: theme.sizes.borderRadius.small,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        fontFamily: theme.fonts.main,
                        fontWeight: 600,
                        minWidth: isMobile ? '120px' : '150px',
                        opacity: isSubmitting ? 0.7 : 1,
                        fontSize: isMobile ? '0.9rem' : '1rem',
                        order: isMobile ? 1 : 2
                    }}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
            ) : (
                <button
                    type="button"
                    onClick={onNext}
                    disabled={nextDisabled || isSubmitting}
                    style={{
                        backgroundColor: nextDisabled || isSubmitting ? theme.colors.gray[300] : theme.colors.primary,
                        color: theme.colors.white,
                        border: 'none',
                        padding: isMobile ? `${theme.sizes.spacing.sm} ${theme.sizes.spacing.md}` : `${theme.sizes.spacing.sm} ${theme.sizes.spacing.lg}`,
                        borderRadius: theme.sizes.borderRadius.small,
                        cursor: nextDisabled || isSubmitting ? 'not-allowed' : 'pointer',
                        fontFamily: theme.fonts.main,
                        fontWeight: 600,
                        minWidth: isMobile ? '120px' : '150px',
                        opacity: nextDisabled || isSubmitting ? 0.7 : 1,
                        fontSize: isMobile ? '0.9rem' : '1rem',
                        order: isMobile ? 1 : 2
                    }}
                >
                    Next
                </button>
            )}
        </div>
    );
};

const SuccessMessage = ({ theme }) => {
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    
    return (
        <div style={{
            maxWidth: theme.sizes.container.form,
            margin: '0 auto',
            padding: isMobile ? theme.sizes.spacing.md : theme.sizes.spacing.xl,
            backgroundColor: theme.colors.white,
            borderRadius: theme.sizes.borderRadius.medium,
            boxShadow: theme.shadows.md,
            textAlign: 'center'
        }}>
            <div style={{
                color: theme.colors.success,
                fontSize: isMobile ? '2.5rem' : '3rem',
                marginBottom: theme.sizes.spacing.md
            }}>
                ✓
            </div>
            <h2 style={{
                fontFamily: theme.fonts.heading,
                color: theme.colors.primaryDark,
                marginBottom: theme.sizes.spacing.md,
                fontSize: isMobile ? '1.5rem' : '1.8rem'
            }}>
                Thank You for Your Application!
            </h2>
            <p style={{ 
                marginBottom: theme.sizes.spacing.sm,
                fontSize: isMobile ? '0.9rem' : '1rem'
            }}>
                Your admission form has been successfully submitted to Literacy Tree School.
            </p>
            <p style={{ 
                marginBottom: theme.sizes.spacing.xl,
                fontSize: isMobile ? '0.9rem' : '1rem'
            }}>
                We will review your application and contact you within 5-7 business days.
            </p>

            <div style={{
                marginTop: theme.sizes.spacing.xl,
                paddingTop: theme.sizes.spacing.lg,
                borderTop: `1px solid ${theme.colors.gray[200]}`
            }}>
                <h3 style={{
                    fontFamily: theme.fonts.heading,
                    color: theme.colors.primary,
                    marginBottom: theme.sizes.spacing.md,
                    fontSize: isMobile ? '1.2rem' : '1.4rem'
                }}>
                    Need Help?
                </h3>
                <p style={{ 
                    marginBottom: theme.sizes.spacing.sm,
                    fontSize: isMobile ? '0.9rem' : '1rem'
                }}>
                    <strong>Email:</strong> admissions@literacytree.edu
                </p>
                <p style={{ 
                    fontSize: isMobile ? '0.9rem' : '1rem'
                }}>
                    <strong>Phone:</strong> (123) 456-7890
                </p>
            </div>
        </div>
    );
};

export default AdmissionForm;
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from './styles/themes';

const AdmissionForm = () => {
    const theme = useTheme();
    const [submitted, setSubmitted] = useState(false);
    const [showUnderFiveCard, setShowUnderFiveCard] = useState(false);
    const [showAllergyDetails, setShowAllergyDetails] = useState(false);
    const [showVaccinationDetails, setShowVaccinationDetails] = useState(false);

    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const signatureRef = useRef(null);
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
        if (validateStep(currentStep)) {
            try {
                setIsSubmitting(true);
                const formPayload = new FormData();

                // Append all form data to FormData object
                Object.entries(formData).forEach(([section, fields]) => {
                    Object.entries(fields).forEach(([field, value]) => {
                        // Handle file fields
                        if (field === 'underFiveCard' || field === 'passportPhoto') {
                            if (value) formPayload.append(field, value);
                        }
                        // Handle array data (emergencyContacts)
                        else if (field === 'emergencyContacts') {
                            value.forEach(item => formPayload.append(`${section}.${field}[]`, item));
                        }
                        // Handle nested objects
                        else if (typeof value === 'object' && value !== null) {
                            Object.entries(value).forEach(([subField, subValue]) => {
                                formPayload.append(`${section}.${field}.${subField}`, subValue);
                            });
                        }
                        // Handle regular fields
                        else {
                            formPayload.append(`${section}.${field}`, value);
                        }
                    });
                });

                // Append files if they exist
                if (formData.documents.underFiveCard) {
                    formPayload.append('underFiveCard', formData.documents.underFiveCard);
                }
                if (formData.documents.passportPhoto) {
                    formPayload.append('passportPhoto', formData.documents.passportPhoto);
                }

                const response = await fetch('/api/admissions', {
                    method: 'POST',
                    body: formPayload
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Submission failed');
                }

                await response.json();
                setSubmitted(true);
            } catch (error) {
                console.error('Submission error:', error);
                // Show error to user
                alert(`Submission failed: ${error.message}`);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const setupSignaturePad = useCallback(() => {
        const canvas = signatureRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            [lastX, lastY] = [e.offsetX, e.offsetY];
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            [lastX, lastY] = [e.offsetX, e.offsetY];
        });

        canvas.addEventListener('mouseup', () => {
            isDrawing = false;
            handleChange('declaration', 'signatureData', canvas.toDataURL());
        });

        canvas.addEventListener('mouseout', () => {
            isDrawing = false;
        });
    }, [handleChange]);


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
            padding: theme.sizes.spacing.xl
        }}>
            <div style={{
                maxWidth: theme.sizes.container.form,
                margin: '0 auto'
            }}>
                <header style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.white,
                    padding: theme.sizes.spacing.lg,
                    borderRadius: `${theme.sizes.borderRadius.medium} ${theme.sizes.borderRadius.medium} 0 0`,
                    textAlign: 'center'
                }}>
                    <img
                        src="/school-logo.jpg"
                        alt="Literacy Tree School Logo"
                        style={{
                            height: theme.sizes.header.height,
                            marginBottom: theme.sizes.spacing.md
                        }}
                    />
                    <h1 style={{
                        fontFamily: theme.fonts.heading,
                        margin: 0,
                        fontSize: '1.8rem'
                    }}>
                        Literacy Tree School Admission Form
                    </h1>
                    <p style={{
                        margin: `${theme.sizes.spacing.sm} 0 0`,
                        fontWeight: 600,
                        opacity: 0.9
                    }}>
                        2025-2026 Academic Year - {getFormStage(currentStep).replace('_', ' ').toUpperCase()}
                    </p>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: theme.sizes.spacing.lg
                    }}>
                        {[1, 2, 3, 4].map(step => (
                            <div
                                key={step}
                                style={{
                                    flex: 1,
                                    textAlign: 'center',
                                    padding: theme.sizes.spacing.sm,
                                    backgroundColor: currentStep >= step ? theme.colors.accent : theme.colors.gray[200],
                                    color: currentStep >= step ? theme.colors.white : theme.colors.text,
                                    fontWeight: currentStep >= step ? 600 : 400,
                                    position: 'relative'
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
                    padding: theme.sizes.spacing.xl,
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
                            />
                            <TextInput
                                label="Child's Surname"
                                value={formData.childInfo.surname}
                                onChange={(value) => handleChange('childInfo', 'surname', value)}
                                error={errors.surname}
                                required
                                theme={theme}
                            />
                            <TextInput
                                label="Date of Birth"
                                type="date"
                                value={formData.childInfo.dob}
                                onChange={(value) => handleChange('childInfo', 'dob', value)}
                                error={errors.dob}
                                required
                                theme={theme}
                            />
                            <TextInput
                                label="Child's Age"
                                value={formData.childInfo.age}
                                readOnly
                                theme={theme}
                            />
                            <TextInput
                                label="Place of Birth"
                                value={formData.childInfo.placeOfBirth}
                                onChange={(value) => handleChange('childInfo', 'placeOfBirth', value)}
                                error={errors.placeOfBirth}
                                required
                                theme={theme}
                            />
                            <TextInput
                                label="Nationality"
                                value={formData.childInfo.nationality}
                                onChange={(value) => handleChange('childInfo', 'nationality', value)}
                                error={errors.nationality}
                                required
                                theme={theme}
                            />
                            <TextInput
                                label="Religion"
                                value={formData.childInfo.religion}
                                onChange={(value) => handleChange('childInfo', 'religion', value)}
                                theme={theme}
                            />
                            <FormNavigation
                                onNext={nextStep}
                                nextDisabled={false}
                                isSubmitting={isSubmitting}
                                theme={theme}
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
                            />
                            <TextInput
                                label="Father's Contact Number"
                                type="tel"
                                value={formData.parentInfo.fathersContact}
                                onChange={(value) => handleChange('parentInfo', 'fathersContact', value)}
                                theme={theme}
                            />
                            <TextInput
                                label="Mother's Name"
                                value={formData.parentInfo.mothersName}
                                onChange={(value) => handleChange('parentInfo', 'mothersName', value)}
                                theme={theme}
                            />
                            <TextInput
                                label="Mother's Contact Number"
                                type="tel"
                                value={formData.parentInfo.mothersContact}
                                onChange={(value) => handleChange('parentInfo', 'mothersContact', value)}
                                theme={theme}
                            />
                            <TextArea
                                label="Residential Address"
                                value={formData.parentInfo.residentialAddress}
                                onChange={(value) => handleChange('parentInfo', 'residentialAddress', value)}
                                error={errors.residentialAddress}
                                required
                                theme={theme}
                            />
                            <FormNavigation
                                onPrev={prevStep}
                                onNext={nextStep}
                                isSubmitting={isSubmitting}
                                theme={theme}
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
                            />
                            {showAllergyDetails && (
                                <TextArea
                                    label="If yes, specify allergies"
                                    value={formData.healthInfo.allergyDetails}
                                    onChange={(value) => handleChange('healthInfo', 'allergyDetails', value)}
                                    theme={theme}
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
                            />
                            {showVaccinationDetails && (
                                <TextArea
                                    label="If no, specify vaccination details"
                                    value={formData.healthInfo.vaccinationDetails}
                                    onChange={(value) => handleChange('healthInfo', 'vaccinationDetails', value)}
                                    theme={theme}
                                />
                            )}

                            <CheckboxGroup
                                label="Emergency Contact Methods (Select all that apply)"
                                options={['Phone', 'Email', 'SMS', 'WhatsApp']}
                                selected={formData.healthInfo.emergencyContacts}
                                onChange={(value, checked) => handleCheckboxChange('healthInfo', 'emergencyContacts', value, checked)}
                                theme={theme}
                            />

                            <TextArea
                                label="Doctor's Details"
                                value={formData.healthInfo.doctorDetails}
                                onChange={(value) => handleChange('healthInfo', 'doctorDetails', value)}
                                theme={theme}
                            />
                            <TextInput
                                label="Doctor's Contact Number"
                                type="tel"
                                value={formData.healthInfo.doctorContact}
                                onChange={(value) => handleChange('healthInfo', 'doctorContact', value)}
                                theme={theme}
                            />

                            <FormNavigation
                                onPrev={prevStep}
                                onNext={nextStep}
                                isSubmitting={isSubmitting}
                                theme={theme}
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
                                    />
                                )}
                            </div>
                            <FileInput
                                label="Upload a Passport Size Photo"
                                id="passportPhoto"
                                onChange={(e) => handleFileChange('passportPhoto', e)}
                                accept="image/*"
                                theme={theme}
                            />
                            <TextArea
                                label="Any other information about the child"
                                value={formData.otherInfo}
                                onChange={(value) => handleChange('', 'otherInfo', value)}
                                theme={theme}
                            />
                            <div style={{ margin: `${theme.sizes.spacing.lg} 0` }}>
                                <p style={{ marginBottom: theme.sizes.spacing.sm }}>
                                    I, <TextInput
                                        inline
                                        value={formData.declaration.declarationName}
                                        onChange={(value) => handleChange('declaration', 'declarationName', value)}
                                        placeholder="Enter your full name"
                                        required
                                        theme={theme}
                                    />, hereby agree to pay all tuition fees in good time and that my child will comply with all school regulations.
                                </p>
                                <div style={{ margin: `${theme.sizes.spacing.md} 0` }}>
                                    <label style={{ display: 'block', marginBottom: theme.sizes.spacing.sm }}>Parent's Signature:</label>
                                    <canvas
                                        ref={signatureRef}
                                        id="signatureCanvas"
                                        width={300}
                                        height={150}
                                        style={{ border: `1px solid ${theme.colors.border}`, borderRadius: theme.sizes.borderRadius.small }}
                                    ></canvas>
                                    <button
                                        type="button"
                                        onClick={clearSignature}
                                        style={{
                                            marginTop: theme.sizes.spacing.sm,
                                            background: 'none',
                                            border: 'none',
                                            color: theme.colors.primary,
                                            textDecoration: 'underline',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Clear Signature
                                    </button>
                                </div>
                            </div>
                            <p style={{ fontStyle: 'italic', textAlign: 'center', marginTop: theme.sizes.spacing.lg }}>
                                "TO TEACH IS TO TOUCH A LIFE FOREVER."
                            </p>
                            <FormNavigation
                                onPrev={prevStep}
                                onSubmit={handleSubmit}
                                isLastStep={true}
                                isSubmitting={isSubmitting}
                                theme={theme}
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
    return (
        <div>
            <h2 style={{
                color: theme.colors.primaryDark,
                fontFamily: theme.fonts.heading,
                marginBottom: theme.sizes.spacing.lg,
                paddingBottom: theme.sizes.spacing.sm,
                borderBottom: `2px solid ${theme.colors.gray[200]}`
            }}>
                {title}
            </h2>
            <div style={{ marginBottom: theme.sizes.spacing.xl }}>
                {children}
            </div>
        </div>
    );
};

const FileInput = ({ label, id, onChange, accept, theme }) => {
    return (
        <div style={{ marginBottom: theme.sizes.spacing.lg }}>
            <label style={{
                display: 'block',
                marginBottom: theme.sizes.spacing.sm,
                fontWeight: 600,
                color: theme.colors.text
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
                    padding: theme.sizes.spacing.sm,
                    fontFamily: theme.fonts.main
                }}
            />
        </div>
    );
};

const TextInput = ({ label, type = 'text', value, onChange, error, required, placeholder, theme, inline }) => {
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
                    minWidth: '200px',
                    padding: '0.25rem 0.5rem',
                    border: `1px solid ${error ? theme.colors.error : theme.colors.border}`,
                    borderRadius: theme.sizes.borderRadius.small,
                    fontFamily: theme.fonts.main,
                    margin: '0 0.25rem'
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
                color: theme.colors.text
            }}>
                {label}
                {required && <span style={{ color: theme.colors.error }}>*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    padding: theme.sizes.spacing.sm,
                    border: `1px solid ${error ? theme.colors.error : theme.colors.border}`,
                    borderRadius: theme.sizes.borderRadius.small,
                    fontFamily: theme.fonts.main
                }}
            />
            {error && (
                <div style={{
                    color: theme.colors.error,
                    fontSize: '0.875rem',
                    marginTop: theme.sizes.spacing.sm
                }}>
                    {error}
                </div>
            )}
        </div>
    );
};

const TextArea = ({ label, value, onChange, error, required, placeholder, theme }) => {
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
                color: theme.colors.text
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
                    minHeight: '100px',
                    padding: theme.sizes.spacing.sm,
                    border: `1px solid ${error ? theme.colors.error : theme.colors.border}`,
                    borderRadius: theme.sizes.borderRadius.small,
                    fontFamily: theme.fonts.main,
                    resize: 'vertical'
                }}
            />
            {error && (
                <div style={{
                    color: theme.colors.error,
                    fontSize: '0.875rem',
                    marginTop: theme.sizes.spacing.sm
                }}>
                    {error}
                </div>
            )}
        </div>
    );
};

const SelectInput = ({ label, value, onChange, options, error, required, theme }) => {
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
                color: theme.colors.text
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
                    padding: theme.sizes.spacing.sm,
                    border: `1px solid ${error ? theme.colors.error : theme.colors.border}`,
                    borderRadius: theme.sizes.borderRadius.small,
                    fontFamily: theme.fonts.main
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
                    fontSize: '0.875rem',
                    marginTop: theme.sizes.spacing.sm
                }}>
                    {error}
                </div>
            )}
        </div>
    );
};

const CheckboxGroup = ({ label, options, selected, onChange, theme }) => {
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
                color: theme.colors.text
            }}>
                {label}
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.sizes.spacing.md }}>
                {options.map(option => (
                    <label key={option} style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer'
                    }}>
                        <input
                            type="checkbox"
                            checked={selected.includes(option)}
                            onChange={(e) => handleChange(option, e.target.checked)}
                            style={{
                                marginRight: theme.sizes.spacing.sm,
                                accentColor: theme.colors.primary
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
    theme
}) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: theme.sizes.spacing.xl,
            paddingTop: theme.sizes.spacing.lg,
            borderTop: `1px solid ${theme.colors.gray[200]}`
        }}>
            {onPrev ? (
                <button
                    type="button"
                    onClick={onPrev}
                    style={{
                        backgroundColor: theme.colors.gray[200],
                        color: theme.colors.text,
                        border: 'none',
                        padding: `${theme.sizes.spacing.sm} ${theme.sizes.spacing.lg}`,
                        borderRadius: theme.sizes.borderRadius.small,
                        cursor: 'pointer',
                        fontFamily: theme.fonts.main,
                        fontWeight: 600
                    }}
                >
                    Previous
                </button>
            ) : (
                <div></div>
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
                        padding: `${theme.sizes.spacing.sm} ${theme.sizes.spacing.lg}`,
                        borderRadius: theme.sizes.borderRadius.small,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        fontFamily: theme.fonts.main,
                        fontWeight: 600,
                        minWidth: '150px',
                        opacity: isSubmitting ? 0.7 : 1
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
                        padding: `${theme.sizes.spacing.sm} ${theme.sizes.spacing.lg}`,
                        borderRadius: theme.sizes.borderRadius.small,
                        cursor: nextDisabled || isSubmitting ? 'not-allowed' : 'pointer',
                        fontFamily: theme.fonts.main,
                        fontWeight: 600,
                        minWidth: '150px',
                        opacity: nextDisabled || isSubmitting ? 0.7 : 1
                    }}
                >
                    Next
                </button>
            )}
        </div>
    );
};

const SuccessMessage = ({ theme }) => {
    return (
        <div style={{
            maxWidth: theme.sizes.container.form,
            margin: '0 auto',
            padding: theme.sizes.spacing.xl,
            backgroundColor: theme.colors.white,
            borderRadius: theme.sizes.borderRadius.medium,
            boxShadow: theme.shadows.md,
            textAlign: 'center'
        }}>
            <div style={{
                color: theme.colors.success,
                fontSize: '3rem',
                marginBottom: theme.sizes.spacing.md
            }}>
                ✓
            </div>
            <h2 style={{
                fontFamily: theme.fonts.heading,
                color: theme.colors.primaryDark,
                marginBottom: theme.sizes.spacing.md
            }}>
                Thank You for Your Application!
            </h2>
            <p style={{ marginBottom: theme.sizes.spacing.sm }}>
                Your admission form has been successfully submitted to Literacy Tree School.
            </p>
            <p style={{ marginBottom: theme.sizes.spacing.xl }}>
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
                    marginBottom: theme.sizes.spacing.md
                }}>
                    Need Help?
                </h3>
                <p style={{ marginBottom: theme.sizes.spacing.sm }}>
                    <strong>Email:</strong> admissions@literacytree.edu
                </p>
                <p>
                    <strong>Phone:</strong> (123) 456-7890
                </p>
            </div>
        </div>
    );
};

export default AdmissionForm;
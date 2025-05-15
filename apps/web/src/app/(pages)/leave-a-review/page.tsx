'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const RATING_CATEGORIES = [
    { key: 'buildQuality', label: 'Build Quality' },
    { key: 'purchaseExperienceRating', label: 'Purchase Experience Rating' },
    { key: 'amenities', label: 'Amenities' },
    { key: 'neighbourhoodLocation', label: 'Neighbourhood / Location' },
    { key: 'valueForMoney', label: 'Value for Money' },
    { key: 'serviceQuality', label: 'Service Quality' },
];

function RatingBar({ value, onChange, label }: { value: number, onChange: (v: number) => void, label: string }) {
    const [hover, setHover] = useState<number | null>(null);
    return (
        <div className="flex flex-col gap-1 w-full">
            <div className="flex flex-row items-center justify-between w-full">
                <span className="text-md font-medium">{label}</span>
                <span className="text-muted-foreground text-sm">{value} / 10</span>
            </div>
            <div className="flex flex-row gap-1 mt-1 w-full mb-1">
                {Array.from({ length: 10 }).map((_, idx) => (
                    <button
                        type="button"
                        key={idx}
                        className={`h-2.5 w-full rounded-full transition-colors cursor-pointer duration-100 ${(hover !== null ? idx < hover + 1 : idx < value) ? 'bg-primary' : 'bg-muted-foreground/30'
                            }`}
                        onMouseEnter={() => setHover(idx)}
                        onMouseLeave={() => setHover(null)}
                        onClick={() => onChange(idx + 1)}
                        aria-label={`Set rating to ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default function LeaveAReviewPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    // State za rezidencije
    const [residences, setResidences] = useState([]);
    const [residenceSearch, setResidenceSearch] = useState('');
    const [selectedResidence, setSelectedResidence] = useState('');
    const [loadingResidences, setLoadingResidences] = useState(false);
    const [residencePage, setResidencePage] = useState(1);
    const [hasMoreResidences, setHasMoreResidences] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);
    const [dateOfPurchase, setDateOfPurchase] = useState('');
    const [unitTypes, setUnitTypes] = useState([]);
    const [unitTypeSearch, setUnitTypeSearch] = useState('');
    const [selectedUnitType, setSelectedUnitType] = useState('');
    const [loadingUnitTypes, setLoadingUnitTypes] = useState(false);
    const [unitTypeSelectOpen, setUnitTypeSelectOpen] = useState(false);
    const [additionalFeedback, setAdditionalFeedback] = useState('');
    const [isPrimaryResidence, setIsPrimaryResidence] = useState(false);
    const [verifiedOwnerOrTenant, setVerifiedOwnerOrTenant] = useState(false);
    const [ratings, setRatings] = useState({
        buildQuality: 0,
        purchaseExperienceRating: 0,
        amenities: 0,
        neighbourhoodLocation: 0,
        valueForMoney: 0,
        serviceQuality: 0,
    });
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const preselectedResidenceId = searchParams.get('residenceId');

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.replace('/login');
            } else if (user.role?.name !== 'buyer') {
                router.replace('/'); // ili na neku drugu stranicu po želji
            }
        }
    }, [user, isLoading, router]);

    // Fetch residences with infinite scroll
    useEffect(() => {
        setResidences([]);
        setResidencePage(1);
        setHasMoreResidences(true);
    }, [residenceSearch]);

    useEffect(() => {
        const fetchResidences = async () => {
            setLoadingResidences(true);
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
            let url = `${baseUrl}/api/${apiVersion}/public/residences?page=${residencePage}&limit=30`;
            if (residenceSearch) {
                url += `&query=${encodeURIComponent(residenceSearch)}`;
            }
            const res = await fetch(url);
            const data = await res.json();
            setResidences(prev => residencePage === 1 ? (data.data || []) : [...prev, ...(data.data || [])]);
            setHasMoreResidences(residencePage < (data.pagination?.totalPages || 1));
            setLoadingResidences(false);
        };
        fetchResidences();
    }, [residenceSearch, residencePage]);

    // Infinite scroll observer
    const lastResidenceRef = useCallback((node: HTMLDivElement | null) => {
        if (loadingResidences || !hasMoreResidences) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setResidencePage(prev => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loadingResidences, hasMoreResidences]);

    // Lazy load unit types on open
    useEffect(() => {
        if (unitTypeSelectOpen && unitTypes.length === 0) {
            setLoadingUnitTypes(true);
            const fetchUnitTypes = async () => {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
                const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
                let url = `${baseUrl}/api/${apiVersion}/unit-types`;
                if (unitTypeSearch) {
                    url += `?query=${encodeURIComponent(unitTypeSearch)}`;
                }
                const res = await fetch(url);
                const data = await res.json();
                setUnitTypes(data.data || []);
                setLoadingUnitTypes(false);
            };
            fetchUnitTypes();
        }
    }, [unitTypeSelectOpen, unitTypeSearch, unitTypes.length]);

    const handleRatingChange = useCallback((key: string, value: number) => {
        setRatings(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { [key: string]: string } = {};
        if (!selectedResidence) newErrors.residenceId = 'Please select a residence.';
        if (!dateOfPurchase) newErrors.dateOfPurchase = 'Please select date of purchase.';
        if (!selectedUnitType) newErrors.unitTypeId = 'Please select unit type.';
        if (!verifiedOwnerOrTenant) newErrors.verifiedOwnerOrTenant = 'You must confirm you are a verified owner or tenant.';
        if (ratings.buildQuality === 0) newErrors.buildQuality = 'Build Quality is required.';
        if (ratings.purchaseExperienceRating === 0) newErrors.purchaseExperienceRating = 'Purchase Experience Rating is required.';
        if (ratings.amenities === 0) newErrors.amenities = 'Amenities rating is required.';
        if (ratings.neighbourhoodLocation === 0) newErrors.neighbourhoodLocation = 'Neighbourhood / Location rating is required.';
        if (ratings.valueForMoney === 0) newErrors.valueForMoney = 'Value for Money rating is required.';
        if (ratings.serviceQuality === 0) newErrors.serviceQuality = 'Service Quality rating is required.';
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;
        setSubmitting(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
            const payload = {
                residenceId: selectedResidence,
                dateOfPurchase,
                unitTypeId: selectedUnitType,
                additionalFeedback,
                isPrimaryResidence,
                verifiedOwnerOrTenant,
                ...ratings,
            };
            const res = await fetch(`${baseUrl}/api/${apiVersion}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Failed to submit review');
            }
            toast.success('Review submitted successfully!');
            // Resetuj formu
            setSelectedResidence('');
            setDateOfPurchase('');
            setSelectedUnitType('');
            setAdditionalFeedback('');
            setIsPrimaryResidence(false);
            setVerifiedOwnerOrTenant(false);
            setRatings({
                buildQuality: 0,
                purchaseExperienceRating: 0,
                amenities: 0,
                neighbourhoodLocation: 0,
                valueForMoney: 0,
                serviceQuality: 0,
            });
            setResidenceSearch('');
            setUnitTypeSearch('');
            setErrors({});
        } catch (error: any) {
            toast.error(error.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    // Preselect residenceId from query param
    useEffect(() => {
        if (
            preselectedResidenceId &&
            residences.length > 0 &&
            residences.some((r: { id: string }) => r.id === preselectedResidenceId)
        ) {
            setSelectedResidence(preselectedResidenceId);
        }
    }, [preselectedResidenceId, residences]);

    if (isLoading || !user || user.role?.name !== 'buyer') {
        return null;
    }

    return (
        <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-12">
            <div className="page-header flex flex-col gap-6 w-full">
                <p className="text-md uppercase text-left lg:text-center text-primary">Leave review</p>
                <h1 className="text-4xl font-bold text-left lg:text-center">We Value Your Review</h1>
                <p className="text-left lg:text-center text-lg max-w-full lg:max-w-3xl mx-auto">
                    Get personalized assistance and expert advice from our experienced consultants to make the best decisions for your property needs
                </p>
            </div>

            <form onSubmit={handleSubmit} className='custom-form-wrapper w-full lg:w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4'>
                {/* Leva strana */}
                <div className="flex flex-col custom-form border rounded-lg p-4 lg:p-6">
                    {/* Select za rezidenciju sa pretragom (pretraga unutar SelectContent) */}
                    <div className='flex flex-col gap-2'>
                        <label className="text-md font-medium">Property Name</label>
                        <Select
                            value={selectedResidence}
                            onValueChange={setSelectedResidence}
                            open={undefined}
                            onOpenChange={undefined}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={loadingResidences ? 'Loading...' : 'Select residence'} />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                                <div className="p-2 sticky top-0 bg-background z-10 search-wrapper">
                                    <Input
                                        placeholder="Search residences..."
                                        value={residenceSearch}
                                        onChange={e => setResidenceSearch(e.target.value)}
                                        className="w-full"
                                        onClick={e => e.stopPropagation()}
                                        onKeyDown={e => {
                                            if (e.key !== "Escape" && e.key !== "Enter") {
                                                e.stopPropagation();
                                            }
                                        }}
                                    />
                                </div>
                                {loadingResidences && residences.length === 0 ? (
                                    <SelectItem value="LOADING" disabled>
                                        Loading residences...
                                    </SelectItem>
                                ) : residences.length > 0 ? (
                                    residences.map((res: any, idx: number) => (
                                        <SelectItem
                                            key={res.id}
                                            value={res.id}
                                            ref={idx === residences.length - 1 ? lastResidenceRef : null}
                                        >
                                            {res.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                                        No residences found
                                    </div>
                                )}
                                {loadingResidences && residences.length > 0 && (
                                    <div className="p-2 text-sm text-center">Loading more...</div>
                                )}
                            </SelectContent>
                        </Select>
                        {errors.residenceId && <span className="text-destructive text-sm">{errors.residenceId}</span>}

                    </div>
                    {/* Date of purchase */}
                    <div className='flex flex-col gap-2'>
                        <label className="text-md font-medium mt-4">Date of Purchase</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !dateOfPurchase && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateOfPurchase ? format(new Date(dateOfPurchase), "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-secondary" align="start">
                                <Calendar
                                    mode="single"
                                    selected={dateOfPurchase ? new Date(dateOfPurchase) : undefined}
                                    onSelect={(day) => {
                                        if (day) {
                                            setDateOfPurchase(format(day, "yyyy-MM-dd"))
                                        } else {
                                            setDateOfPurchase("")
                                        }
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.dateOfPurchase && <span className="text-destructive text-sm">{errors.dateOfPurchase}</span>}
                    </div>

                    {/* Unit type select (lazy load) */}
                    <div className='flex flex-col gap-2'>
                        <label className="text-md font-medium mt-4">Unit Type</label>
                        <Select
                            value={selectedUnitType}
                            onValueChange={setSelectedUnitType}
                            open={unitTypeSelectOpen}
                            onOpenChange={setUnitTypeSelectOpen}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={loadingUnitTypes ? 'Loading...' : 'Select unit type'} />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                                {unitTypes.map((ut: any) => (
                                    <SelectItem key={ut.id} value={ut.id}>
                                        {ut.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.unitTypeId && <span className="text-destructive text-sm">{errors.unitTypeId}</span>}

                    </div>
                    {/* Additional Feedback */}
                    <div className='flex flex-col gap-2'>
                        <label className="text-md font-medium mt-4">Additional Feedback</label>
                        <Textarea
                            placeholder="Share your experience..."
                            value={additionalFeedback}
                            onChange={e => setAdditionalFeedback(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {/* Is this a primary residence */}
                    <div className="flex items-center gap-2 mt-4">
                        <Switch
                            checked={isPrimaryResidence}
                            onCheckedChange={setIsPrimaryResidence}
                            id="primary-residence-switch"
                        />
                        <label htmlFor="primary-residence-switch" className="text-md font-medium">Is this a primary residence?</label>
                    </div>

                    {/* Verified owner/tenant checkbox */}
                    <div className='flex flex-col gap-2'>
                        <div className="flex items-start gap-2 mt-4">
                            <Checkbox
                                checked={verifiedOwnerOrTenant}
                                onCheckedChange={val => setVerifiedOwnerOrTenant(val === true)}
                                id="verified-owner-checkbox"
                                className='mt-1'
                            />
                            <label htmlFor="verified-owner-checkbox" className="text-md font-medium">
                                I confirm that I am a verified property owner or tenant in this residence and that my review is based on my personal experience.
                            </label>
                        </div>
                        {errors.verifiedOwnerOrTenant && <span className="text-destructive text-sm ms-6">{errors.verifiedOwnerOrTenant}</span>}
                    </div>
                </div>
                {/* Desna strana */}
                <div className="flex flex-col gap-6 border rounded-lg p-4 lg:p-6 justify-between">
                    {RATING_CATEGORIES.map(cat => (
                        <div key={cat.key} className="flex flex-col gap-1 w-full">
                            <RatingBar
                                value={ratings[cat.key as keyof typeof ratings]}
                                onChange={v => handleRatingChange(cat.key, v)}
                                label={cat.label}
                            />
                            {errors[cat.key] && (
                                <span className="text-destructive text-sm">{errors[cat.key]}</span>
                            )}
                        </div>
                    ))}
                </div>
                {/* Dugme za submit - uvek na dnu forme, ispod obe kolone */}
                <div className="col-span-1 lg:col-span-2 flex justify-end mt-1">
                    <Button type="submit" className="w-full lg:w-auto" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Leave a review'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
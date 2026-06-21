'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { HarmonicNumberInput } from '@/components/ui/harmonic-number-input';

type FilterDict = {
  title: string;
  type: string;
  movie: string;
  tv: string;
  all: string;
  minRating: string;
  maxRating: string;
  hasSpoilers: string;
  orderBy: string;
  date: string;
  rating: string;
  asc: string;
  desc: string;
  clear: string;
  apply: string;
  dateDesc: string;
  dateAsc: string;
  ratingDesc: string;
  ratingAsc: string;
  yes: string;
  no: string;
};

export const ProfileReviewsFilter = ({ dict }: { dict: FilterDict }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [type, setType] = useState<string>(searchParams.get('type') || '');
  const [minRating, setMinRating] = useState<string>(searchParams.get('minRating') || '');
  const [maxRating, setMaxRating] = useState<string>(searchParams.get('maxRating') || '');
  const [hasSpoilers, setHasSpoilers] = useState<string>(searchParams.get('hasSpoilers') || '');
  
  const orderByParam = searchParams.get('orderBy') || 'Date';
  const isAscendingParam = searchParams.get('isAscendingOrder') || 'false';
  
  const initialSort = orderByParam === 'Rating' 
    ? (isAscendingParam === 'true' ? 'ratingAsc' : 'ratingDesc')
    : (isAscendingParam === 'true' ? 'dateAsc' : 'dateDesc');

  const [currentSort, setCurrentSort] = useState<string>(initialSort);

  useEffect(() => {
    setType(searchParams.get('type') || '');
    setMinRating(searchParams.get('minRating') || '');
    setMaxRating(searchParams.get('maxRating') || '');
    setHasSpoilers(searchParams.get('hasSpoilers') || '');
    
    const obs = searchParams.get('orderBy') || 'Date';
    const iap = searchParams.get('isAscendingOrder') || 'false';
    setCurrentSort(obs === 'Rating' 
      ? (iap === 'true' ? 'ratingAsc' : 'ratingDesc')
      : (iap === 'true' ? 'dateAsc' : 'dateDesc')
    );
  }, [searchParams]);

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1'); 
    
    if (type) params.set('type', type);
    else params.delete('type');

    if (minRating) params.set('minRating', minRating);
    else params.delete('minRating');

    if (maxRating) params.set('maxRating', maxRating);
    else params.delete('maxRating');

    if (hasSpoilers) params.set('hasSpoilers', hasSpoilers);
    else params.delete('hasSpoilers');

    if (currentSort === 'dateDesc') {
      params.set('orderBy', 'Date');
      params.set('isAscendingOrder', 'false');
    } else if (currentSort === 'dateAsc') {
      params.set('orderBy', 'Date');
      params.set('isAscendingOrder', 'true');
    } else if (currentSort === 'ratingDesc') {
      params.set('orderBy', 'Rating');
      params.set('isAscendingOrder', 'false');
    } else if (currentSort === 'ratingAsc') {
      params.set('orderBy', 'Rating');
      params.set('isAscendingOrder', 'true');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    router.push(pathname);
  };

  const selectClassName = "bg-black/20 border border-white/10 rounded-md px-2 py-1.5 text-xs text-white/80 focus:outline-none focus:ring-1 focus:ring-primary/50 w-full mt-1.5";
  const numberInputClassName = "h-[30px] mt-1.5 bg-black/20 border-white/10 text-white/80";
  const labelClassName = "text-xs text-white/50 block";

  return (
    <div className="bg-card border border-border/40 rounded-xl p-5 shadow-sm flex flex-col gap-5">
      <h3 className="font-semibold text-lg tracking-tight">{dict.title}</h3>
      
      <div className="flex flex-col gap-4">
        <div>
          <label className={labelClassName}>{dict.orderBy}</label>
          <select 
            value={currentSort} 
            onChange={(e) => setCurrentSort(e.target.value)}
            className={selectClassName}
          >
            <option value="dateDesc">{dict.dateDesc}</option>
            <option value="dateAsc">{dict.dateAsc}</option>
            <option value="ratingDesc">{dict.ratingDesc}</option>
            <option value="ratingAsc">{dict.ratingAsc}</option>
          </select>
        </div>

        <div>
          <label className={labelClassName}>{dict.type}</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            className={selectClassName}
          >
            <option value="">{dict.all}</option>
            <option value="0">{dict.movie}</option>
            <option value="1">{dict.tv}</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClassName}>{dict.minRating}</label>
            <HarmonicNumberInput 
              min={0} max={10} step={1}
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              placeholder="0"
              className={numberInputClassName}
            />
          </div>

          <div>
            <label className={labelClassName}>{dict.maxRating}</label>
            <HarmonicNumberInput 
              min={0} max={10} step={1}
              value={maxRating}
              onChange={(e) => setMaxRating(e.target.value)}
              placeholder="10"
              className={numberInputClassName}
            />
          </div>
        </div>

        <div>
          <label className={labelClassName}>{dict.hasSpoilers}</label>
          <select 
            value={hasSpoilers} 
            onChange={(e) => setHasSpoilers(e.target.value)}
            className={selectClassName}
          >
            <option value="">{dict.all}</option>
            <option value="true">{dict.yes}</option>
            <option value="false">{dict.no}</option>
          </select>
        </div>
      </div>

      <div className="flex justify-center w-full gap-3 pt-4">
        <Button variant="outline" size="sm" onClick={handleClear} className="text-xs flex-1">
          {dict.clear}
        </Button>
        <Button size="sm" onClick={handleApply} className="text-xs flex-1">
          {dict.apply}
        </Button>
      </div>
    </div>
  );
};

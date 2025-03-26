<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reclamation extends Model
{
    use HasFactory;

    protected $fillable = [
        'description',
        'category',
        'name',
        'adress',
        'CIN',
        'telephone',
        'age',
        'etat', // Add this
        'email',
        'file_path',
        'status'
    ];

    // Define constants for etat values
    const ETAT_PAS_ENCOURS = 'pas encours';
    const ETAT_ENCOURS = 'encours';
    const ETAT_FINIS = 'finis';

    // Optionally, define a method to get all possible states
    public static function getEtatOptions()
    {
        return [
            self::ETAT_PAS_ENCOURS => 'Pas Encours',
            self::ETAT_ENCOURS => 'En Cours',
            self::ETAT_FINIS => 'Finis',
        ];
    }

    public function getFileUrlAttribute()
    {
        return $this->file_path ? asset('storage/' . $this->file_path) : null;
    }
}

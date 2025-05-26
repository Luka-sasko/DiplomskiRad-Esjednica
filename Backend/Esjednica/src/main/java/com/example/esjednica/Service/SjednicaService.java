package com.example.esjednica.Service;

import com.example.esjednica.Model.*;
import com.example.esjednica.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SjednicaService {
    @Autowired
    private SjednicaRepository sjednicaRepository;
    @Autowired
    private GlasRepository glasRepository;


    public Sjednica saveSjednica(Sjednica sjednica) {
        return sjednicaRepository.save(sjednica);
    }

    public List<Sjednica> getAllSjednice() {
        return sjednicaRepository.findAll();
    }

    public Optional<Sjednica> findById(Long id) {
        return sjednicaRepository.findById(id);
    }

    public void deleteById(Long id) {
        sjednicaRepository.deleteById(id);
    }

    public Map<String, Integer> getRezultati(Long tockaId) {
        List<Glas> glasovi = glasRepository.findByTockaId(tockaId);
        Map<String, Integer> rezultati = new HashMap<>();
        rezultati.put("ZA", 0);
        rezultati.put("PROTIV", 0);
        rezultati.put("UZDRŽAN", 0);
        for (Glas glas : glasovi) {
            rezultati.put(glas.getGlas(), rezultati.get(glas.getGlas()) + 1);
        }
        return rezultati;
    }

}
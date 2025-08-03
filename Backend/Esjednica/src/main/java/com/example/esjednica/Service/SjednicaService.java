package com.example.esjednica.Service;

import com.example.esjednica.Model.*;
import com.example.esjednica.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SjednicaService {
    @Autowired
    private SjednicaRepository sjednicaRepository;
    public Sjednica saveSjednica(Sjednica sjednica) {
        return sjednicaRepository.save(sjednica);
    }
    public List<Sjednica> getAllSjednice() {
        return sjednicaRepository.findAll();
    }
    public List<Sjednica> getActiveSjednice() {
        LocalDateTime curretnLocalDateTime = LocalDateTime.now();
        return sjednicaRepository.findAllActive(curretnLocalDateTime);
    }
    public Optional<Sjednica> findById(Long id) {
        return sjednicaRepository.findById(id);
    }
    public void deleteById(Long id) {
        sjednicaRepository.deleteById(id);
    }


}
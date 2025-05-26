package com.example.esjednica.Service;

import com.example.esjednica.Model.Tocka;
import com.example.esjednica.Repository.TockaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TockaService {

    @Autowired
    private TockaRepository tockaRepository;

    public Tocka saveTocka(Tocka tocka) {
        return tockaRepository.save(tocka);
    }

    public List<Tocka> findBySjednicaId(Long sjednicaId) {
        return tockaRepository.findBySjednicaId(sjednicaId);
    }

    public Tocka findById(Long id) {
        return tockaRepository.findById(id).orElse(null);
    }

    public void deleteTocka(Long id) {
        tockaRepository.deleteById(id);
    }


}
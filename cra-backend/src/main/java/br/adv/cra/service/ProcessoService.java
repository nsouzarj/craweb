package br.adv.cra.service;

import br.adv.cra.entity.Comarca;
import br.adv.cra.entity.Orgao;
import br.adv.cra.entity.Processo;
import br.adv.cra.repository.ProcessoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProcessoService {
    
    private final ProcessoRepository processoRepository;
    
    public Processo salvar(Processo processo) {
        return processoRepository.save(processo);
    }
    
    public Processo atualizar(Processo processo) {
        if (!processoRepository.existsById(processo.getId())) {
            throw new RuntimeException("Processo não encontrado");
        }
        return processoRepository.save(processo);
    }
    
    public void deletar(Long id) {
        if (!processoRepository.existsById(id)) {
            throw new RuntimeException("Processo não encontrado");
        }
        processoRepository.deleteById(id);
    }
    
    @Transactional(readOnly = true)
    public Optional<Processo> buscarPorId(Long id) {
        return processoRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public List<Processo> listarTodos() {
        return processoRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<Processo> buscarPorNumeroProcesso(String numeroprocesso) {
        return processoRepository.findByNumeroprocesso(numeroprocesso);
    }
    
    @Transactional(readOnly = true)
    public List<Processo> buscarPorNumeroProcessoPesquisa(String numero) {
        return processoRepository.findByNumeroprocessopesqContaining(numero);
    }
    
    @Transactional(readOnly = true)
    public List<Processo> buscarPorParte(String parte) {
        return processoRepository.findByParteContaining(parte);
    }
    
    @Transactional(readOnly = true)
    public List<Processo> buscarPorAdverso(String adverso) {
        return processoRepository.findByAdversoContaining(adverso);
    }
    
    @Transactional(readOnly = true)
    public List<Processo> buscarPorStatus(String status) {
        return processoRepository.findByStatus(status);
    }
    
    @Transactional(readOnly = true)
    public List<Processo> buscarPorComarca(Comarca comarca) {
        return processoRepository.findByComarca(comarca);
    }
    
    @Transactional(readOnly = true)
    public List<Processo> buscarPorOrgao(Orgao orgao) {
        return processoRepository.findByOrgao(orgao);
    }
    
    @Transactional(readOnly = true)
    public List<Processo> buscarPorAssunto(String assunto) {
        return processoRepository.findByAssuntoContaining(assunto);
    }
    
    @Transactional(readOnly = true)
    public List<Processo> buscarPorProcessoEletronico(String processoEletronico) {
        return processoRepository.findByProceletronico(processoEletronico);
    }
    
    @Transactional(readOnly = true)
    public boolean existeNumeroProcesso(String numeroprocesso) {
        return processoRepository.existsByNumeroprocesso(numeroprocesso);
    }
    
    @Transactional(readOnly = true)
    public boolean existeNumeroProcessoParaOutroProcesso(String numeroprocesso, Long id) {
        Optional<Processo> processo = processoRepository.findByNumeroprocesso(numeroprocesso);
        return processo.isPresent() && !processo.get().getId().equals(id);
    }
    
    @Transactional(readOnly = true)
    public Long contarPorStatus(String status) {
        return processoRepository.countByStatus(status);
    }
}
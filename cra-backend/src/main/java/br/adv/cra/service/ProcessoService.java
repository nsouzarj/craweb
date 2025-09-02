package br.adv.cra.service;

import br.adv.cra.entity.Comarca;
import br.adv.cra.entity.Orgao;
import br.adv.cra.entity.Processo;
import br.adv.cra.repository.ProcessoRepository;
import br.adv.cra.repository.OrgaoRepository;
import br.adv.cra.dto.ProcessoDTO;
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
    private final OrgaoRepository orgaoRepository;
    
    /**
     * Obtém um órgão existente pelo ID
     * @param orgaoId ID do órgão
     * @return Optional com o órgão encontrado
     */
    private Optional<Orgao> getOrgaoExistente(Long orgaoId) {
        if (orgaoId == null) {
            return Optional.empty();
        }
        return orgaoRepository.findById(orgaoId);
    }
    
    /**
     * Obtém um órgão existente pela descrição
     * @param descricao Descrição do órgão
     * @return Optional com o órgão encontrado
     */
    private Optional<Orgao> getOrgaoExistentePorDescricao(String descricao) {
        if (descricao == null || descricao.isEmpty()) {
            return Optional.empty();
        }
        List<Orgao> orgaos = orgaoRepository.findByDescricaoContaining(descricao);
        return orgaos.isEmpty() ? Optional.empty() : Optional.of(orgaos.get(0));
    }
    
    public Processo salvar(Processo processo) {
        // Sempre desassocia o órgão do processo antes de salvar para evitar criação acidental
        Orgao orgao = processo.getOrgao();
        processo.setOrgao(null);
        
        // Salva o processo primeiro sem o órgão
        Processo savedProcesso = processoRepository.save(processo);
        
        // Agora associa o órgão existente, se fornecido
        if (orgao != null && orgao.getId() != null) {
            // Verifica se o órgão existe
            Optional<Orgao> orgaoExistente = getOrgaoExistente(orgao.getId());
            if (orgaoExistente.isPresent()) {
                // Associa o órgão existente ao processo salvo
                savedProcesso.setOrgao(orgaoExistente.get());
                // Atualiza o processo com a associação ao órgão
                savedProcesso = processoRepository.save(savedProcesso);
            } else {
                throw new RuntimeException("Órgão com ID " + orgao.getId() + " não encontrado");
            }
        } else if (orgao != null && orgao.getDescricao() != null) {
            // Se foi fornecido um órgão com descrição mas sem ID, tenta encontrar pelo nome
            Optional<Orgao> orgaoExistente = getOrgaoExistentePorDescricao(orgao.getDescricao());
            if (orgaoExistente.isPresent()) {
                // Usa o órgão encontrado
                savedProcesso.setOrgao(orgaoExistente.get());
                // Atualiza o processo com a associação ao órgão
                savedProcesso = processoRepository.save(savedProcesso);
            } else {
                throw new RuntimeException("Órgão com descrição '" + orgao.getDescricao() + "' não encontrado");
            }
        }
        
        return savedProcesso;
    }
    
    public Processo salvarComDTO(ProcessoDTO processoDTO) {
        Processo processo = new Processo();
        processo.setId(processoDTO.getId());
        processo.setNumeroprocesso(processoDTO.getNumeroprocesso());
        processo.setNumeroprocessopesq(processoDTO.getNumeroprocessopesq());
        processo.setParte(processoDTO.getParte());
        processo.setAdverso(processoDTO.getAdverso());
        processo.setPosicao(processoDTO.getPosicao());
        processo.setStatus(processoDTO.getStatus());
        processo.setCartorio(processoDTO.getCartorio());
        processo.setAssunto(processoDTO.getAssunto());
        processo.setLocalizacao(processoDTO.getLocalizacao());
        processo.setNumerointegracao(processoDTO.getNumerointegracao());
        processo.setNumorgao(processoDTO.getNumorgao());
        processo.setProceletronico(processoDTO.getProceletronico());
        processo.setQuantsoli(processoDTO.getQuantsoli());
        processo.setDatadistribuicao(processoDTO.getDatadistribuicao());
        processo.setObservacao(processoDTO.getObservacao());
        
        // Salva o processo primeiro sem o órgão
        Processo savedProcesso = processoRepository.save(processo);
        
        // Agora associa o órgão existente, se fornecido
        if (processoDTO.getOrgaoId() != null) {
            Optional<Orgao> orgaoExistente = getOrgaoExistente(processoDTO.getOrgaoId());
            if (orgaoExistente.isPresent()) {
                savedProcesso.setOrgao(orgaoExistente.get());
                // Atualiza o processo com a associação ao órgão
                savedProcesso = processoRepository.save(savedProcesso);
            } else {
                throw new RuntimeException("Órgão com ID " + processoDTO.getOrgaoId() + " não encontrado");
            }
        }
        
        return savedProcesso;
    }
    
    public Processo atualizar(Processo processo) {
        if (!processoRepository.existsById(processo.getId())) {
            throw new RuntimeException("Processo não encontrado");
        }
        
        // Para atualização, também precisamos garantir que não criamos órgãos acidentalmente
        Orgao orgao = processo.getOrgao();
        processo.setOrgao(null);
        
        // Atualiza o processo primeiro sem o órgão
        Processo updatedProcesso = processoRepository.save(processo);
        
        // Agora associa o órgão existente, se fornecido
        if (orgao != null && orgao.getId() != null) {
            // Verifica se o órgão existe
            Optional<Orgao> orgaoExistente = getOrgaoExistente(orgao.getId());
            if (orgaoExistente.isPresent()) {
                // Associa o órgão existente ao processo atualizado
                updatedProcesso.setOrgao(orgaoExistente.get());
                // Atualiza o processo com a associação ao órgão
                updatedProcesso = processoRepository.save(updatedProcesso);
            } else {
                throw new RuntimeException("Órgão com ID " + orgao.getId() + " não encontrado");
            }
        }
        
        return updatedProcesso;
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
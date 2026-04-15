package com.linhdev.drumify.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.linhdev.drumify.dto.warehouse.SupplierRequest;
import com.linhdev.drumify.dto.warehouse.SupplierResponse;
import com.linhdev.drumify.entity.Supplier;
import com.linhdev.drumify.exception.AppException;
import com.linhdev.drumify.exception.ErrorCode;
import com.linhdev.drumify.mapper.SupplierMapper;
import com.linhdev.drumify.repository.SupplierRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SupplierService {
    SupplierRepository supplierRepository;
    SupplierMapper supplierMapper;

    public List<SupplierResponse> listSuppliers() {
        return supplierRepository.findByActiveTrueOrderByNameAsc().stream()
                .map(supplierMapper::toSupplierResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SupplierResponse createSupplier(SupplierRequest request) {
        Supplier s = Supplier.builder()
                .name(request.getName().trim())
                .contactName(trimToNull(request.getContactName()))
                .phone(trimToNull(request.getPhone()))
                .email(trimToNull(request.getEmail()))
                .address(trimToNull(request.getAddress()))
                .taxCode(trimToNull(request.getTaxCode()))
                .note(trimToNull(request.getNote()))
                .active(request.getActive() == null || request.getActive())
                .build();
        return supplierMapper.toSupplierResponse(supplierRepository.save(s));
    }

    @Transactional
    public SupplierResponse updateSupplier(String id, SupplierRequest request) {
        Supplier s = supplierRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        s.setName(request.getName().trim());
        s.setContactName(trimToNull(request.getContactName()));
        s.setPhone(trimToNull(request.getPhone()));
        s.setEmail(trimToNull(request.getEmail()));
        s.setAddress(trimToNull(request.getAddress()));
        s.setTaxCode(trimToNull(request.getTaxCode()));
        s.setNote(trimToNull(request.getNote()));
        if (request.getActive() != null) {
            s.setActive(request.getActive());
        }
        return supplierMapper.toSupplierResponse(supplierRepository.save(s));
    }

    @Transactional
    public void deactivateSupplier(String id) {
        Supplier s = supplierRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        s.setActive(false);
        supplierRepository.save(s);
    }

    private String trimToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }
}
